import { DatePicker, Input, Select } from 'antd'

import RelationSelect from './RelationSelect'

const CONTROL_BY_TYPE = {
    date: DatePicker,
    dateRange: DatePicker.RangePicker,
    select: Select,
    search: Input,
    text: Input,
}

const getFieldKey = (name) => (Array.isArray(name) ? name.join('.') : name)

export default function BaseFilterControl({ field, context = {} }) {
    const Control = CONTROL_BY_TYPE[field.type || 'text'] || Input
    const placeholder = field.placeholder || field.label

    if (field.render) return field.render(field)
    if (field.type === 'relation') {
        const key = getFieldKey(field.name)
        return (
            <RelationSelect
                allowClear={field.allowClear !== false}
                field={field}
                form={context.form}
                loadOptions={context.loadOptions}
                mode={field.mode}
                options={context.relationOptions?.[key] || []}
                placeholder={placeholder}
                showSearch={field.showSearch !== false}
                {...field.controlProps}
            />
        )
    }
    if (field.type === 'select') {
        return (
            <Control
                allowClear={field.allowClear !== false}
                loading={field.loading}
                mode={field.mode}
                optionFilterProp="label"
                options={field.options || []}
                placeholder={placeholder}
                showSearch={field.showSearch !== false}
                {...field.controlProps}
            />
        )
    }
    if (field.type === 'dateRange') {
        return (
            <Control
                allowClear
                format="DD/MM/YYYY"
                placeholder={field.placeholder || ['Từ ngày', 'Đến ngày']}
                {...field.controlProps}
            />
        )
    }
    if (field.type === 'date') {
        return (
            <Control
                allowClear
                format="DD/MM/YYYY"
                placeholder={placeholder}
                {...field.controlProps}
            />
        )
    }
    return (
        <Control
            allowClear={field.allowClear !== false}
            placeholder={placeholder}
            type={field.inputType}
            {...field.controlProps}
        />
    )
}
