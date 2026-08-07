import { useMemo, useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Form, message, Tabs, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Form as AntForm } from 'antd'
import { createRenderField } from '@/utils/fields/fieldRegistry'

import {
    getLaravelConflictError,
    getLaravelValidationError,
    mapLaravelErrorsToFields,
} from '@/utils/formErrors'
import { extractRelationConfigs } from '@/utils/extractRelationConfigs'
import { buildDefaultValues, mergeFormValues } from '@/utils/formDefaults'

import { usePermission } from '@/hooks/usePermission.jsx'
import { useRelationOptions } from '@/hooks/useRelationOptions.jsx'
import BaseFormFooter from './BaseFormFooter'
import {
    flattenFields,
    normalizeGroups,
    toNamePath,
} from './BaseForm/formUtils'
import { buildSubmitPayload } from './BaseForm/formSubmit'
import {
    isFormSubmitBlocked,
    runFormSubmitIfAllowed,
} from './BaseForm/formSubmitPolicy'
import { buildFormErrorMessages } from './BaseForm/formErrors'
import { useComputedFields } from './BaseForm/formComputed'
import {
    buildDependentResetFields,
    clearChangedErrors,
    runFieldChangeHandlers,
} from './BaseForm/formChange'

export default function BaseForm({
    form: externalForm,
    fields = [],
    tabs = null,
    sections = null,
    record = null,
    onFinish,
    onValuesChange,
    autoInitialize = true,
    onCancel,
    isCancel = true,
    loading = false,
    cancelText = 'Huỷ',
    submitText = 'Lưu',
    showFooter = true,
    destroyInactiveTabs = false,
    context,
    embedded = false,
    conflictHandledExternally = false,
    submitDisabled = false,
}) {
    const { can } = usePermission()

    /**
     * session key (nếu cần tracking form instance)
     */
    const formSessionRef = useRef(null)
    const [innerForm] = useForm()

    const form = useMemo(
        () => externalForm ?? innerForm,
        [externalForm, innerForm],
    )

    const [serverErrors, setServerErrors] = useState({})
    const [activeTabKey, setActiveTabKey] = useState(tabs?.[0]?.key)

    const initRef = useRef(false)
    const cascadeReadyRef = useRef(false)
    const syncingFieldRef = useRef(null)
    const dirtyRef = useRef(false)
    const initializedSignatureRef = useRef('')
    const runCascadeRef = useRef(null)

    /**
     * Watch toàn bộ form values
     * => cực quan trọng: trigger rerender relation UI
     */
    const rawValues = AntForm.useWatch([], form)
    const values = useMemo(() => rawValues || {}, [rawValues])

    /**
     * group fields (tabs hoặc single form)
     */
    const groups = useMemo(
        () => normalizeGroups({ fields, tabs, sections }),
        [fields, tabs, sections],
    )
    /**
     * flatten tất cả fields để extract relation configs
     */
    useEffect(() => {
        if (!tabs?.length) return

        setActiveTabKey((current) =>
            tabs.some((tab) => tab.key === current) ? current : tabs[0].key,
        )
    }, [tabs])

    const allFields = useMemo(() => {
        const root = groups.flatMap((g) => g.fields || [])
        return flattenFields(root)
    }, [groups])

    /**
     * =========================
     * DEFAULT VALUES (ONLY CREATE)
     * =========================
     */
    const defaultValues = useMemo(
        () => buildDefaultValues(allFields),
        [allFields],
    )

    /**
     * =========================================================
     * KẾ THỪA: Áp dụng hàm trộn và làm sạch dữ liệu số thực sự mergeFormValues
     * giúp loại bỏ hoàn toàn các chuỗi số thập phân gây lỗi hiển thị trong Antd
     * mà không ảnh hưởng tới luồng tìm dữ liệu liên kết.
     * =========================================================
     */
    const initialFormValues = useMemo(() => {
        return mergeFormValues({
            defaults: defaultValues,
            record,
            fields: allFields,
        })
    }, [defaultValues, record, allFields])

    /**
     * lấy toàn bộ config relation (dynamic select)
     */
    const relationConfigs = useMemo(
        () => extractRelationConfigs(allFields, 'name'),
        [allFields],
    )

    /**
     * hook xử lý toàn bộ relation:
     * - cache
     * - cascade
     * - hydrate edit
     */
    const { relationOptions, loadOptions, runCascade } = useRelationOptions(
        relationConfigs,
        form,
        record,
        context,
    )

    useEffect(() => {
        runCascadeRef.current = runCascade
    }, [runCascade])

    /**
     * tạo session id theo record
     * (có thể dùng nếu muốn isolate cache theo record)
     */
    useEffect(() => {
        formSessionRef.current = `${Date.now()}-${Math.random()}`
    }, [record?.id])

    /**
     * =========================
     * INIT FORM VALUES + RELATIONS
     * =========================
     * Initialise once per record/schema and execute one cascade after the
     * values are committed. Older code ran three independent cascades plus
     * one per watched render, which could create an endless request cycle.
     */
    const initializationSignature = useMemo(
        () =>
            JSON.stringify({
                recordId: record?.id ?? null,
                values: initialFormValues || {},
            }),
        [initialFormValues, record?.id],
    )

    useEffect(() => {
        if (!autoInitialize) {
            initRef.current = true
            cascadeReadyRef.current = true
            return undefined
        }

        // Không khởi tạo lại cùng một record/schema khi parent chỉ đổi loading,
        // context hoặc callback. Re-initialize trong lúc người dùng đang sửa sẽ
        // ghi đè draft và xoá validation message vừa được gắn vào field.
        if (initializedSignatureRef.current === initializationSignature) {
            return undefined
        }

        let mounted = true
        const frameId = requestAnimationFrame(async () => {
            if (!mounted) return

            cascadeReadyRef.current = false
            initRef.current = false
            dirtyRef.current = false

            form.resetFields()
            form.setFieldsValue(initialFormValues)
            initializedSignatureRef.current = initializationSignature

            await Promise.resolve()
            if (!mounted) return

            cascadeSnapshotRef.current = JSON.stringify(initialFormValues || {})
            await runCascadeRef.current?.(initialFormValues)
            if (!mounted) return

            initRef.current = true
            cascadeReadyRef.current = true
        })

        return () => {
            mounted = false
            cancelAnimationFrame(frameId)
        }
    }, [autoInitialize, form, initialFormValues, initializationSignature])

    const cascadeSnapshotRef = useRef('')

    useEffect(() => {
        if (!cascadeReadyRef.current || !initRef.current || !form) return

        const snapshot = JSON.stringify(values || {})
        if (snapshot === cascadeSnapshotRef.current) return
        cascadeSnapshotRef.current = snapshot

        runCascade(values || {})
    }, [values, form, runCascade])

    useComputedFields({ fields: allFields, values, form, record })

    /**
     * =========================================================
     * ON CHANGE FORM
     * =========================================================
     * - reset field phụ thuộc
     * - chạy cascade reload
     */
    const handleValuesChange = (changed, allValues) => {
        if (initRef.current) {
            dirtyRef.current = true
        }
        const changedKeys = Object.keys(changed)

        clearChangedErrors({
            changedKeys,
            setServerErrors,
            form,
        })

        runFieldChangeHandlers({
            changed,
            allValues,
            fields: allFields,
            form,
            record,
            syncingFieldRef,
        })

        const resetFields = buildDependentResetFields({
            changedKeys,
            relationConfigs,
            fields: allFields,
        })

        if (Object.keys(resetFields).length) {
            // Tránh race condition AntD internal state
            requestAnimationFrame(() => {
                form.setFieldsValue(resetFields)
            })
        }

        requestAnimationFrame(() => {
            runCascade({
                ...allValues,
                ...resetFields,
            })
        })

        onValuesChange?.(changed, allValues)
    }

    // =========================
    // 🔥 HANDLE CANCEL ADDED
    // =========================
    const handleCancel = () => {
        if (onCancel?.() === false) return false

        requestAnimationFrame(() => {
            setServerErrors({})

            form?.resetFields?.()

            const values = form?.getFieldsValue?.(true) || {}

            form?.setFields?.(
                Object.keys(values).map((key) => ({
                    name: key,
                    errors: [],
                })),
            )
        })

        return true
    }

    const renderField = useMemo(
        () =>
            createRenderField({
                values,
                record,
                form,
                context,
                relationOptions,
                relationConfigs,
                loadOptions,
                serverErrors,
                can,
            }),
        [
            values,
            record,
            form,
            context,
            relationOptions,
            relationConfigs,
            loadOptions,
            serverErrors,
            can,
        ],
    )

    /**
     * render group (tab or normal form)
     */
    const renderGroup = useCallback(
        (group) => <Row gutter={[16, 0]}>{group.fields.map(renderField)}</Row>,
        [renderField],
    )

    /**
     * tabs config
     */
    const tabItems = useMemo(
        () =>
            groups.map((g) => ({
                key: String(g.key),
                label: g.label,
                children: <div key={g.key}>{renderGroup(g)}</div>,
            })),
        [groups, renderGroup],
    )

    const renderSections = useCallback(
        () => (
            <div className="base-form-sections">
                {groups.map((group) => (
                    <section className="base-form-section" key={group.key}>
                        {group.label || group.description ? (
                            <div className="base-form-section__head">
                                {group.label ? <h3>{group.label}</h3> : null}
                                {group.description ? (
                                    <p>{group.description}</p>
                                ) : null}
                            </div>
                        ) : null}
                        {renderGroup(group)}
                    </section>
                ))}
            </div>
        ),
        [groups, renderGroup],
    )

    const formErrorMessages = useMemo(() => {
        return buildFormErrorMessages({
            fields: allFields,
            serverErrors,
        })
    }, [allFields, serverErrors])

    const clearErrors = () => {
        setServerErrors({})

        requestAnimationFrame(() => {
            form.setFields(
                form.getFieldsError().map((f) => ({
                    name: f.name,
                    errors: [],
                })),
            )
        })
    }

    const focusFirstError = useCallback(
        (fieldNames = []) => {
            const firstName = fieldNames.find(Boolean)
            if (!firstName) return

            const normalizedName = Array.isArray(firstName)
                ? firstName
                : String(firstName).split('.')
            const rootName = normalizedName[0]
            const errorGroup = groups.find((group) =>
                (group.fields || []).some(
                    (field) => toNamePath(field.name)[0] === rootName,
                ),
            )

            if (tabs?.length && errorGroup?.key) {
                setActiveTabKey(errorGroup.key)
            }

            requestAnimationFrame(() => {
                form.scrollToField(normalizedName, {
                    behavior: 'smooth',
                    block: 'center',
                })
                form.getFieldInstance?.(normalizedName)?.focus?.()
            })
        },
        [form, groups, tabs],
    )

    /**
     * submit form
     */
    const handleFinish = async () =>
        runFormSubmitIfAllowed({ submitDisabled, loading }, async () => {
            clearErrors()

            try {
                const vals = form.getFieldsValue(true)
                const payload = buildSubmitPayload({
                    fields: allFields,
                    values: vals,
                    record,
                    form,
                })

                await onFinish(payload)

                if (!record?.id) {
                    form.resetFields()
                }
            } catch (err) {
                const conflictError = getLaravelConflictError(err)
                if (conflictError) {
                    if (conflictHandledExternally) return

                    const errors = conflictError.errors || {
                        _form: [conflictError.message],
                    }
                    setServerErrors(errors)
                    if (conflictError.errors) {
                        form.setFields(
                            mapLaravelErrorsToFields(conflictError.errors),
                        )
                    }
                    message.warning(conflictError.message)
                    return
                }

                const validationError = getLaravelValidationError(err)

                if (validationError) {
                    const errors = validationError.errors || {}
                    setServerErrors(errors)
                    form.setFields(mapLaravelErrorsToFields(errors))
                    focusFirstError(Object.keys(errors))
                    message.error(
                        'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.',
                    )
                    return
                }

                const errorMessage = err?.message || 'Có lỗi xảy ra'

                setServerErrors({ _form: errorMessage })
                message.error(errorMessage)
            }
        })

    const handleFinishFailed = ({ errorFields }) => {
        if (isFormSubmitBlocked({ submitDisabled, loading })) return false

        const errors = {}

        errorFields.forEach((field) => {
            const name = field.name?.[0]
            if (!name) return

            errors[name] = field.errors?.[0]
        })

        setServerErrors(errors)

        form.setFields(
            errorFields.map((f) => ({
                name: f.name,
                errors: f.errors,
            })),
        )

        focusFirstError(errorFields.map((field) => field.name))
        message.error(
            'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.',
        )
    }

    if (!form?.getFieldValue) {
        return <Form form={innerForm} style={{ display: 'none' }} />
    }

    const formContent = (
        <>
            <div className="base-form-content">
                {formErrorMessages.length ? (
                    <Alert
                        className="base-form-server-errors"
                        type="error"
                        showIcon
                        title="Không thể lưu dữ liệu"
                        description={
                            formErrorMessages.length === 1 ? (
                                formErrorMessages[0].message
                            ) : (
                                <ul>
                                    {formErrorMessages.map((item) => (
                                        <li key={item.key}>{item.message}</li>
                                    ))}
                                </ul>
                            )
                        }
                    />
                ) : null}

                {tabs ? (
                    <Tabs
                        activeKey={activeTabKey}
                        onChange={setActiveTabKey}
                        items={tabItems}
                        destroyOnHidden={destroyInactiveTabs}
                        className="base-form-tabs"
                    />
                ) : sections ? (
                    renderSections()
                ) : (
                    renderGroup(groups[0])
                )}
            </div>

            {showFooter ? (
                <BaseFormFooter
                    isCancel={isCancel}
                    onCancel={handleCancel}
                    loading={loading}
                    cancelText={cancelText}
                    submitText={submitText}
                    submitDisabled={submitDisabled}
                />
            ) : null}
        </>
    )

    // Cho phép nhiều nhóm field dùng chung một Form instance nhưng chỉ có một
    // <Form> owner ở component cha. Điều này tránh Ant Design unregister field
    // hoặc kích hoạt nhiều onFinish khi cùng form instance bị gắn vào nhiều Form.
    if (embedded) {
        return (
            <div className="base-form base-form--embedded">{formContent}</div>
        )
    }

    return (
        <Form
            form={form}
            layout="vertical"
            className="base-form"
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            onValuesChange={handleValuesChange}
        >
            {formContent}
        </Form>
    )
}
