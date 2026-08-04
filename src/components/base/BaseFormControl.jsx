import { Checkbox, DatePicker, Input, InputNumber, Select, Switch } from 'antd'

import RelationSelect from './RelationSelect'

export default function BaseFormControl({ field, context = {} }) {
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
        case 'multiple-select':
            return (
                <Select
                    allowClear={field.allowClear ?? true}
                    mode={
                        field.type === 'multiple-select'
                            ? 'multiple'
                            : undefined
                    }
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
