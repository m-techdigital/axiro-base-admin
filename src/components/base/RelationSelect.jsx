import { Select } from 'antd'

export default function RelationSelect({
    value,
    onChange,
    options = [],
    loadOptions,
    field,
    disabled,
    style,
    size = 'middle',
    trigger = 'open',
    placeholder,
    allowClear = true,
    showSearch = true,
    mode,
    form,
    onOpenChange,
    onFocus,
    ...props
}) {
    const shouldReload = field?.source?.reload ?? true
    const context = () => ({ values: form?.getFieldsValue?.(true) || {} })

    const handleOpen = async (open) => {
        onOpenChange?.(open)
        if (!open || !shouldReload) return
        await loadOptions?.(field, context())
    }

    const handleFocus = async (event) => {
        onFocus?.(event)
        if (!shouldReload) return
        await loadOptions?.(field, context())
    }

    const renderOption = field?.optionRender || field?.source?.optionRender

    return (
        <Select
            value={value}
            options={options}
            optionRender={
                renderOption ? (option) => renderOption(option.data) : undefined
            }
            onChange={onChange}
            disabled={disabled}
            style={style}
            size={size}
            placeholder={placeholder}
            allowClear={allowClear}
            mode={mode}
            showSearch={showSearch}
            optionFilterProp="label"
            filterOption={
                showSearch
                    ? (input, option) =>
                          String(option?.searchText ?? option?.label ?? '')
                              .toLowerCase()
                              .includes(input.toLowerCase())
                    : undefined
            }
            onSearch={
                showSearch
                    ? (keyword) =>
                          loadOptions?.(field, { ...context(), keyword })
                    : undefined
            }
            onOpenChange={trigger === 'open' ? handleOpen : onOpenChange}
            onFocus={trigger === 'focus' ? handleFocus : onFocus}
            {...props}
        />
    )
}
