import { Form } from 'antd'
import { useEffect } from 'react'

function normalizeServerErrors(errors = {}) {
    return Object.entries(errors).map(([name, messages]) => ({
        name: name.split('.'),
        errors: Array.isArray(messages) ? messages : [messages],
    }))
}

function BaseForm({
    autoComplete = 'off',
    className = '',
    layout = 'vertical',
    scrollToFirstError = { behavior: 'smooth', block: 'center' },
    serverErrors,
    children,
    form,
    ...props
}) {
    useEffect(() => {
        if (form && serverErrors && Object.keys(serverErrors).length) {
            form.setFields(normalizeServerErrors(serverErrors))
        }
    }, [form, serverErrors])

    return (
        <Form
            autoComplete={autoComplete}
            className={`base-form ${className}`.trim()}
            form={form}
            layout={layout}
            scrollToFirstError={scrollToFirstError}
            {...props}
        >
            {children}
        </Form>
    )
}
Object.assign(BaseForm, {
    Item: Form.Item,
    List: Form.List,
    ErrorList: Form.ErrorList,
    Provider: Form.Provider,
    useForm: Form.useForm,
    useFormInstance: Form.useFormInstance,
    useWatch: Form.useWatch,
    normalizeServerErrors,
})
export default BaseForm
