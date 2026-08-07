import { Checkbox, DatePicker, Input, InputNumber, Select, Switch } from 'antd'
import { cloneElement, isValidElement } from 'react'

import RelationSelect from './RelationSelect'

export default function BaseFormControl({
    field,
    context = {},
    ...injectedControlProps
}) {
    const controlProps = {
        ...(field.props || {}),
        ...injectedControlProps,
    }

    if (typeof field.render === 'function') {
        return field.render(field, {
            ...context,
            controlProps,
        })
    }

    if (isValidElement(field.component)) {
        return cloneElement(field.component, controlProps)
    }

    if (typeof field.component === 'function') {
        const Component = field.component

        return <Component {...controlProps} field={field} context={context} />
    }

    const resolvedOptions =
        typeof field.options === 'function'
            ? field.options(field, context)
            : field.options || []

    switch (field.type) {
        case 'textarea':
            return <Input.TextArea rows={field.rows || 4} {...controlProps} />
        case 'number':
        case 'money':
        case 'number_formatter':
            return <InputNumber className="w-full" {...controlProps} />
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
                    {...controlProps}
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
                    options={resolvedOptions}
                    placeholder={field.placeholder}
                    showSearch={field.showSearch ?? true}
                    {...controlProps}
                />
            )
        case 'switch':
            return <Switch {...controlProps} />
        case 'checkbox':
            return <Checkbox {...controlProps}>{field.text}</Checkbox>
        case 'date':
            return <DatePicker className="w-full" {...controlProps} />
        default:
            return <Input placeholder={field.placeholder} {...controlProps} />
    }
}
