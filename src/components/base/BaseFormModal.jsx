import { useState } from 'react'
import BaseForm from './BaseForm'
import BaseModalForm from './BaseModalForm'

export default function BaseFormModal({
    open,
    width = 800,
    onCancel,

    form,
    record,
    context,
    fields = null,
    tabs = null,
    sections = null,
    service,

    onFinish,
    loading = false,
    submitText,
    title,
    description,
    children,
    conflictHandledExternally = false,
    submitDisabled = false,
    ...modalProps
}) {
    const [resetKey, setResetKey] = useState(0)

    // reset + close in one single flow
    const handleClose = () => {
        if (onCancel?.() === false) return false

        form?.resetFields?.()
        form?.setFieldsValue?.({})
        setResetKey((prev) => prev + 1)
        return true
    }

    // reset explicitly when switching mode (controlled from parent)
    const handleAfterOpenChange = (visible) => {
        if (!visible) return
    }

    return (
        <BaseModalForm
            title={title}
            open={open}
            width={width}
            onCancel={handleClose}
            afterOpenChange={handleAfterOpenChange}
            destroyOnHidden={false}
            {...modalProps}
        >
            {description ? (
                <div className="base-form-modal-description">{description}</div>
            ) : null}
            {children}
            <BaseForm
                key={resetKey}
                form={form}
                record={record}
                context={context}
                fields={fields}
                tabs={tabs}
                sections={sections}
                service={service}
                onCancel={handleClose}
                onFinish={onFinish}
                loading={loading}
                submitText={submitText}
                conflictHandledExternally={conflictHandledExternally}
                submitDisabled={submitDisabled}
            />
        </BaseModalForm>
    )
}
