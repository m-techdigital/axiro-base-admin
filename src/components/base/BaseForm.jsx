import {
    Alert,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Tabs,
    message,
} from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { buildDefaultValues, mergeFormValues } from '@/utils/formDefaults'
import {
    getLaravelConflictError,
    getLaravelValidationError,
    mapLaravelErrorsToFields,
} from '@/utils/formErrors'
import { extractRelationConfigs } from '@/utils/extractRelationConfigs'
import { useRelationOptions } from '@/hooks/useRelationOptions'

import BaseFormFooter from './BaseFormFooter'
import RelationSelect from './RelationSelect'
import {
    buildDependentResetFields,
    clearChangedErrors,
    runFieldChangeHandlers,
} from './BaseForm/formChange'
import { useComputedFields } from './BaseForm/formComputed'
import { buildFormErrorMessages } from './BaseForm/formErrors'
import { buildSubmitPayload } from './BaseForm/formSubmit'
import {
    flattenFields,
    getValueAtPath,
    normalizeGroups,
    resolveHidden,
    setValueAtPath,
    toNamePath,
} from './BaseForm/formUtils'

const normalizeServerErrors = (errors = {}) =>
    mapLaravelErrorsToFields(errors || {})

const renderInputByType = (field, context = {}) => {
    if (typeof field.render === 'function') return field.render(field, context)
    if (field.component) return field.component

    const commonProps = field.props || {}

    switch (field.type) {
        case 'textarea':
            return <Input.TextArea rows={field.rows || 4} {...commonProps} />

        case 'number':
        case 'money':
        case 'number_formatter':
            return <InputNumber className="w-full" {...commonProps} />

        case 'relation':
            return (
                <RelationSelect
                    allowClear={field.allowClear ?? true}
                    field={field}
                    form={context.form}
                    loadOptions={context.loadOptions}
                    mode={field.mode}
                    options={context.relationOptions?.[field.name] || []}
                    placeholder={field.placeholder}
                    showSearch={field.showSearch ?? true}
                    {...commonProps}
                />
            )

        case 'select':
            return (
                <Select
                    allowClear={field.allowClear ?? true}
                    options={field.options || []}
                    placeholder={field.placeholder}
                    showSearch={field.showSearch ?? true}
                    {...commonProps}
                />
            )

        case 'multiple-select':
            return (
                <Select
                    allowClear={field.allowClear ?? true}
                    mode="multiple"
                    options={field.options || []}
                    placeholder={field.placeholder}
                    showSearch={field.showSearch ?? true}
                    {...commonProps}
                />
            )

        case 'switch':
            return <Switch {...commonProps} />

        case 'checkbox':
            return <Checkbox {...commonProps}>{field.text}</Checkbox>

        case 'date':
            return <DatePicker className="w-full" {...commonProps} />

        default:
            return <Input placeholder={field.placeholder} {...commonProps} />
    }
}

const buildItemProps = (field) => {
    const itemProps = field.itemProps || {}

    return {
        name: field.name,
        label: field.label,
        rules: field.rules,
        dependencies: field.dependencies,
        tooltip: field.tooltip,
        extra: field.extra,
        valuePropName:
            field.valuePropName ||
            (['switch', 'checkbox'].includes(field.type)
                ? 'checked'
                : undefined),
        ...itemProps,
    }
}

const resolveGridSpan = (field = {}) => {
    if (field.gridSpan) {
        return Math.max(1, Math.min(12, Number(field.gridSpan)))
    }

    const legacySpan = Number(field.span || 24)
    if (legacySpan >= 24) return 12
    if (legacySpan >= 12) return 12
    if (legacySpan >= 8) return 8
    if (legacySpan >= 6) return 6
    if (legacySpan >= 4) return 4
    return 4
}

const normalizeDateFormValues = (values = {}, fields = []) => {
    const next = { ...values }

    fields.forEach((field) => {
        if (field.type !== 'date' || !field.name) return

        const value = getValueAtPath(next, field.name)
        if (value === undefined || value === null || value === '') return
        if (dayjs.isDayjs(value)) return

        setValueAtPath(next, field.name, dayjs(value))
    })

    return next
}

function BaseForm({
    autoComplete = 'off',
    autoInitialize = true,
    cancelText = 'Huỷ',
    children,
    className = '',
    context,
    destroyInactiveTabs = false,
    embedded = false,
    fields = [],
    form: externalForm,
    initialValues,
    isCancel = true,
    layout = 'vertical',
    loading = false,
    onCancel,
    onFinish,
    onFinishFailed,
    onValuesChange,
    record = null,
    scrollToFirstError = { behavior: 'smooth', block: 'center' },
    sections = null,
    serverErrors: externalServerErrors,
    showFooter = false,
    submitText = 'Lưu',
    tabs = null,
    ...props
}) {
    const [innerForm] = Form.useForm()
    const form = useMemo(
        () => externalForm ?? innerForm,
        [externalForm, innerForm],
    )
    const [serverErrors, setServerErrors] = useState({})
    const [activeTabKey, setActiveTabKey] = useState(tabs?.[0]?.key)
    const initializedSignatureRef = useRef('')
    const cascadeSnapshotRef = useRef('')
    const syncingFieldRef = useRef(null)
    const hasSchema = Boolean(fields.length || tabs?.length || sections?.length)
    const watchedValues = Form.useWatch([], form)
    const values = useMemo(() => watchedValues || {}, [watchedValues])

    const groups = useMemo(
        () => normalizeGroups({ fields, tabs, sections }),
        [fields, sections, tabs],
    )
    const allFields = useMemo(
        () => flattenFields(groups.flatMap((group) => group.fields || [])),
        [groups],
    )
    const relationConfigs = useMemo(
        () => extractRelationConfigs(allFields, 'name'),
        [allFields],
    )
    const { relationOptions, loadOptions, runCascade } = useRelationOptions(
        relationConfigs,
        form,
        record,
        context,
    )
    const defaultValues = useMemo(
        () => buildDefaultValues(allFields),
        [allFields],
    )
    const initialFormValues = useMemo(() => {
        const defaults = initialValues || defaultValues

        return normalizeDateFormValues(
            mergeFormValues({
                defaults,
                record,
                fields: allFields,
            }),
            allFields,
        )
    }, [allFields, defaultValues, initialValues, record])

    useComputedFields({ fields: allFields, values, form, record })

    useEffect(() => {
        if (
            !externalServerErrors ||
            !Object.keys(externalServerErrors).length
        ) {
            return
        }

        setServerErrors(externalServerErrors)
        form.setFields(normalizeServerErrors(externalServerErrors))
    }, [externalServerErrors, form])

    useEffect(() => {
        if (!tabs?.length) return

        setActiveTabKey((current) =>
            tabs.some((tab) => tab.key === current) ? current : tabs[0].key,
        )
    }, [tabs])

    useEffect(() => {
        if (!autoInitialize || !hasSchema) return

        const signature = JSON.stringify({
            recordId: record?.id ?? null,
            values: initialFormValues || {},
        })
        if (initializedSignatureRef.current === signature) return

        form.resetFields()
        form.setFieldsValue(initialFormValues)
        initializedSignatureRef.current = signature
        cascadeSnapshotRef.current = JSON.stringify(initialFormValues || {})
        runCascade(initialFormValues)
    }, [
        autoInitialize,
        form,
        hasSchema,
        initialFormValues,
        record?.id,
        runCascade,
    ])

    useEffect(() => {
        if (!hasSchema || !relationConfigs.length) return

        const snapshot = JSON.stringify(values || {})
        if (snapshot === cascadeSnapshotRef.current) return
        cascadeSnapshotRef.current = snapshot
        runCascade(values || {})
    }, [hasSchema, relationConfigs.length, runCascade, values])

    const focusFirstError = useCallback(
        (fieldNames = []) => {
            const firstName = fieldNames.find(Boolean)
            if (!firstName) return

            const normalizedName = toNamePath(firstName)
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

    const clearErrors = useCallback(() => {
        setServerErrors({})
        requestAnimationFrame(() => {
            form.setFields(
                form.getFieldsError().map((field) => ({
                    name: field.name,
                    errors: [],
                })),
            )
        })
    }, [form])

    const handleValuesChange = (changed, allValues) => {
        const changedKeys = Object.keys(changed)

        clearChangedErrors({ changedKeys, setServerErrors, form })
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
            requestAnimationFrame(() => form.setFieldsValue(resetFields))
        }

        requestAnimationFrame(() => {
            runCascade({
                ...allValues,
                ...resetFields,
            })
        })

        onValuesChange?.(changed, allValues, { form, record, context })
    }

    const handleFinish = async (submittedValues) => {
        clearErrors()

        try {
            const rawValues = hasSchema
                ? form.getFieldsValue(true)
                : submittedValues
            const payload = hasSchema
                ? buildSubmitPayload({
                      fields: allFields,
                      values: rawValues,
                      record,
                      form,
                  })
                : rawValues

            await onFinish?.(payload, { form, record, context })

            if (hasSchema && !record?.id) {
                form.resetFields()
            }
        } catch (err) {
            const conflictError = getLaravelConflictError(err)
            if (conflictError) {
                const errors = conflictError.errors || {
                    _form: [conflictError.message],
                }
                setServerErrors(errors)
                if (conflictError.errors) {
                    form.setFields(mapLaravelErrorsToFields(errors))
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
                const firstMessage = Object.values(errors).flat().find(Boolean)
                message.error(
                    firstMessage ||
                        'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.',
                )
                return
            }

            const errorMessage = err?.message || 'Có lỗi xảy ra'
            setServerErrors({ _form: [errorMessage] })
            message.error(errorMessage)
        }
    }

    const handleFinishFailed = (errorInfo) => {
        const errors = {}
        errorInfo.errorFields?.forEach((field) => {
            const name = field.name?.join?.('.') || field.name?.[0]
            if (name) errors[name] = field.errors
        })

        setServerErrors(errors)
        focusFirstError(errorInfo.errorFields?.map((field) => field.name))
        onFinishFailed?.(errorInfo)
        const firstMessage = errorInfo.errorFields
            ?.flatMap((field) => field.errors || [])
            .find(Boolean)
        message.error(
            firstMessage ||
                'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.',
        )
    }

    const handleCancel = () => {
        onCancel?.()
        requestAnimationFrame(() => {
            setServerErrors({})
            form.resetFields()
            form.setFields(
                form.getFieldsError().map((field) => ({
                    name: field.name,
                    errors: [],
                })),
            )
        })
    }

    const renderField = useCallback(
        (field) => {
            if (!field?.name) {
                if (typeof field?.render === 'function') {
                    return (
                        <div
                            className="base-form-field"
                            key={field.key}
                            style={{ gridColumn: '1 / -1', width: '100%' }}
                        >
                            {field.render(field, {
                                context,
                                form,
                                loadOptions,
                                record,
                                relationOptions,
                                values,
                            })}
                        </div>
                    )
                }

                return null
            }

            if (field.type === 'hidden') {
                return (
                    <Form.Item
                        hidden
                        key={toNamePath(field.name).join('.')}
                        name={field.name}
                    >
                        <Input />
                    </Form.Item>
                )
            }

            if (resolveHidden(field, record, values, form)) return null

            const span = Number(field.span || 24)
            const gridSpan = resolveGridSpan(field)

            return (
                <div
                    className={`base-form-field span-${span}`}
                    key={
                        Array.isArray(field.name)
                            ? field.name.join('.')
                            : field.name
                    }
                    style={{ gridColumn: `span ${gridSpan}` }}
                >
                    <Form.Item {...buildItemProps(field)}>
                        {renderInputByType(field, {
                            context,
                            form,
                            loadOptions,
                            record,
                            relationOptions,
                            values,
                        })}
                    </Form.Item>
                </div>
            )
        },
        [context, form, loadOptions, record, relationOptions, values],
    )

    const renderGroup = useCallback(
        (group) => (
            <div className="base-form-grid">
                {(group.fields || []).map(renderField)}
            </div>
        ),
        [renderField],
    )

    const formErrorMessages = useMemo(
        () => buildFormErrorMessages({ fields: allFields, serverErrors }),
        [allFields, serverErrors],
    )

    const schemaContent = (
        <>
            {formErrorMessages.length ? (
                <Alert
                    className="base-form-server-errors"
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
                    showIcon
                    title="Không thể lưu dữ liệu"
                    type="error"
                />
            ) : null}

            {tabs?.length ? (
                <Tabs
                    activeKey={activeTabKey}
                    className="base-form-tabs"
                    destroyOnHidden={destroyInactiveTabs}
                    items={groups.map((group) => ({
                        key: String(group.key),
                        label: group.label,
                        children: renderGroup(group),
                    }))}
                    onChange={setActiveTabKey}
                />
            ) : sections?.length ? (
                <div className="base-form-sections">
                    {groups.map((group) => (
                        <section className="base-form-section" key={group.key}>
                            {group.label || group.description ? (
                                <div className="base-form-section__head">
                                    {group.label ? (
                                        <h3>{group.label}</h3>
                                    ) : null}
                                    {group.description ? (
                                        <p>{group.description}</p>
                                    ) : null}
                                </div>
                            ) : null}
                            {renderGroup(group)}
                        </section>
                    ))}
                </div>
            ) : (
                renderGroup(groups[0])
            )}

            {showFooter ? (
                <BaseFormFooter
                    cancelText={cancelText}
                    isCancel={isCancel}
                    loading={loading}
                    onCancel={handleCancel}
                    submitText={submitText}
                />
            ) : null}
        </>
    )

    if (embedded) {
        return (
            <div
                className={`base-form base-form--embedded ${className}`.trim()}
            >
                {hasSchema ? schemaContent : children}
            </div>
        )
    }

    return (
        <Form
            autoComplete={autoComplete}
            className={`base-form ${className}`.trim()}
            form={form}
            initialValues={hasSchema ? undefined : initialValues}
            layout={layout}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            onValuesChange={handleValuesChange}
            scrollToFirstError={scrollToFirstError}
            {...props}
        >
            {hasSchema ? schemaContent : children}
        </Form>
    )
}

Object.assign(BaseForm, {
    ErrorList: Form.ErrorList,
    Item: Form.Item,
    List: Form.List,
    Provider: Form.Provider,
    useForm: Form.useForm,
    useFormInstance: Form.useFormInstance,
    useWatch: Form.useWatch,
    normalizeServerErrors,
})

export default BaseForm
