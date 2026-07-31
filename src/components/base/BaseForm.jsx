import { Form } from 'antd'
function BaseForm({ className = '', layout = 'vertical', children, ...props }) {
    return (
        <Form
            className={`base-form ${className}`.trim()}
            layout={layout}
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
})
export default BaseForm
