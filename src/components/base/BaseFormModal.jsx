import { useState } from 'react'

import BaseForm from './BaseForm'
import BaseModalForm from './BaseModalForm'

export default function BaseFormModal({
    context,
    description,
    fields = null,
    form,
    loading = false,
    onCancel,
    onFinish,
    open,
    record,
    sections = null,
    submitText,
    tabs = null,
    title,
    width = 800,
    ...modalProps
}) {
    const [internalForm] = BaseForm.useForm()
    const [resetKey, setResetKey] = useState(0)
    const resolvedForm = form || internalForm

    const handleClose = () => {
        resolvedForm?.resetFields?.()
        resolvedForm?.setFieldsValue?.({})
        setResetKey((value) => value + 1)
        onCancel?.()
    }

    return (
        <BaseModalForm
            destroyOnHidden={false}
            loading={loading}
            onCancel={handleClose}
            onSubmit={() => resolvedForm.submit()}
            open={open}
            submitText={submitText}
            title={title}
            width={width}
            {...modalProps}
        >
            {description ? (
                <div className="base-form-modal-description">{description}</div>
            ) : null}
            <BaseForm
                context={context}
                fields={fields || []}
                form={resolvedForm}
                key={resetKey}
                loading={loading}
                onCancel={handleClose}
                onFinish={onFinish}
                record={record}
                sections={sections}
                showFooter={false}
                submitText={submitText}
                tabs={tabs}
            />
        </BaseModalForm>
    )
}
