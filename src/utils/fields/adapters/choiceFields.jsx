import {
    fieldComponents,
    getIcon,
    normalizeOptions,
    getRelationKey,
} from './fieldAdapterContext'

export function choiceFieldsAdapter(state) {
    const {
        field,
        name,
        type,
        disabled,
        label,
        unit,
        source,
        options,
        values,
        record,
        form,
        relationOptions,
        relationConfigs,
        loadOptions,
        serverErrors,
        ctx,
        common,
        commonRelation,
        commonInput,
        commonSelect,
        wrap,
        resolve,
        resolveDependentOptions,
        __row,
        __listIndex,
        icon,
    } = state
    const {
        dayjs,
        Suspense,
        Form,
        Input,
        Radio,
        Select,
        Checkbox,
        DatePicker,
        TimePicker,
        InputNumber,
        Switch,
        Space,
        Upload,
        Button,
        UploadOutlined,
        RelationSelect,
        BaseListInput,
        BaseNumberFormatter,
        BaseDynamicFormList,
        BaseFaceCapture,
        BaseLocationForm,
        BaseUpload,
        BaseImageUpload,
        BaseEditor,
        normalizeDynamicListErrors,
    } = fieldComponents

    switch (type) {
        case 'select':
        case 'multiple-select': {
            const resolvedOptions = resolveDependentOptions({
                field,
                resolvedOptions: options,
            })

            const isMultiple = type === 'multiple-select'

            return wrap(
                <Select
                    mode={isMultiple ? 'multiple' : undefined}
                    options={normalizeOptions(resolvedOptions, source || {})}
                    disabled={disabled}
                    value={field.value}
                    onChange={field.onChange}
                    {...field.props}
                    {...commonSelect}
                />,
            )
        }

        case 'condition-value': {
            const meta =
                resolve(field.meta, {
                    field,
                    row: __row,
                    listIndex: __listIndex,
                }) || {}
            const operator = resolve(field.operator, {
                field,
                row: __row,
                listIndex: __listIndex,
            })

            if (['empty', 'not_empty'].includes(operator)) {
                return wrap(
                    <Input
                        disabled
                        value=""
                        placeholder="Không cần nhập giá trị"
                    />,
                )
            }

            if (meta?.options?.length) {
                return wrap(
                    <Select
                        allowClear
                        showSearch
                        mode={operator === 'in' ? 'multiple' : undefined}
                        optionFilterProp="label"
                        options={normalizeOptions(meta.options)}
                        disabled={disabled}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={field.placeholder || 'Chọn giá trị'}
                        style={{ width: '100%' }}
                    />,
                )
            }

            if (meta?.type === 'number') {
                return wrap(
                    <InputNumber
                        disabled={disabled}
                        value={field.value}
                        onChange={field.onChange}
                        style={{ width: '100%' }}
                        placeholder={field.placeholder || 'Giá trị số'}
                    />,
                )
            }

            if (meta?.type === 'boolean') {
                return wrap(
                    <Select
                        allowClear
                        disabled={disabled}
                        options={[
                            { value: true, label: 'Có' },
                            { value: false, label: 'Không' },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={field.placeholder || 'Chọn giá trị'}
                        style={{ width: '100%' }}
                    />,
                )
            }

            return wrap(
                <Input
                    disabled={disabled}
                    value={field.value}
                    onChange={(e) => field.onChange?.(e.target.value)}
                    placeholder={
                        meta?.type === 'date'
                            ? 'YYYY-MM-DD'
                            : field.placeholder || 'Giá trị'
                    }
                    {...commonInput}
                />,
            )
        }

        case 'tags':
            return wrap(
                <Select
                    mode="tags"
                    options={normalizeOptions(options)}
                    disabled={disabled}
                    value={field.value}
                    onChange={field.onChange}
                    {...commonSelect}
                />,
            )

        case 'radio-group':
        case 'radio-button': {
            const ButtonComponent = type === 'radio-button'

            return wrap(
                <Radio.Group
                    disabled={disabled}
                    optionType={field.optionType}
                    buttonStyle={field.buttonStyle}
                    value={field.value}
                    onChange={(e) => field.onChange?.(e.target.value)}
                    {...field.props}
                >
                    {normalizeOptions(options).map((opt) => {
                        const Child = ButtonComponent ? Radio.Button : Radio

                        return (
                            <Child key={opt.value} value={opt.value}>
                                <Space size={6}>
                                    {opt.raw?.icon}
                                    <span>{opt.label}</span>
                                </Space>
                            </Child>
                        )
                    })}
                </Radio.Group>,
            )
        }
    }
}
