import { Alert, Input, InputNumber, Select, Tabs } from 'antd'
import { useEffect, useMemo } from 'react'

import BaseForm from './BaseForm'
import BaseModalForm from './BaseModalForm'

const CONTROL_BY_TYPE = {
    number: InputNumber,
    select: Select,
    textarea: Input.TextArea,
    text: Input,
}

function renderField(field) {
    if (field.render) return field.render(field)

    const Control = CONTROL_BY_TYPE[field.type || 'text'] || Input
    const common = {
        allowClear: field.allowClear !== false,
        disabled: field.disabled,
        placeholder: field.placeholder || field.label,
        ...field.controlProps,
    }

    if (field.type === 'select') {
        return <Control options={field.options || []} {...common} />
    }

    if (field.type === 'textarea') {
        return <Control autoSize={{ minRows: 3, maxRows: 8 }} {...common} />
    }

    return <Control style={{ width: '100%' }} {...common} />
}

function renderFields(fields = []) {
    return fields.map((field) => (
        <BaseForm.Item
            extra={field.extra}
            key={Array.isArray(field.name) ? field.name.join('.') : field.name}
            label={field.label}
            name={field.name}
            rules={field.rules}
        >
            {renderField(field)}
        </BaseForm.Item>
    ))
}

export default function BaseFormModal({
    description,
    fields = [],
    form,
    initialValues,
    loading,
    onCancel,
    onFinish,
    onSubmit,
    open,
    record,
    serverErrors,
    submitText = 'Lưu',
    tabs,
    title,
    width = 800,
    ...modalProps
}) {
    const [internalForm] = BaseForm.useForm()
    const resolvedForm = form || internalForm
    const resolvedInitialValues = useMemo(
        () => initialValues || record || {},
        [initialValues, record],
    )
    const resolvedSubmit = onFinish || onSubmit

    useEffect(() => {
        if (!open) return

        resolvedForm.resetFields()
        resolvedForm.setFieldsValue(resolvedInitialValues)
    }, [open, resolvedForm, resolvedInitialValues])

    const tabItems = useMemo(
        () =>
            tabs?.map((tab) => ({
                key: tab.key,
                label: tab.label,
                children: renderFields(tab.fields || []),
            })) || [],
        [tabs],
    )

    return (
        <BaseModalForm
            loading={loading}
            onCancel={onCancel}
            onSubmit={() => resolvedForm.submit()}
            open={open}
            submitText={submitText}
            title={title}
            width={width}
            {...modalProps}
        >
            {description ? (
                <Alert
                    className="base-form-modal-description"
                    message={description}
                    showIcon
                    type="info"
                />
            ) : null}
            <BaseForm
                form={resolvedForm}
                onFinish={resolvedSubmit}
                serverErrors={serverErrors}
            >
                {tabItems.length ? (
                    <Tabs className="base-form-tabs" items={tabItems} />
                ) : (
                    renderFields(fields)
                )}
            </BaseForm>
        </BaseModalForm>
    )
}
