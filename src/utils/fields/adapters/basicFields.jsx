import {
    fieldComponents,
    getIcon,
    normalizeOptions,
    getRelationKey,
} from './fieldAdapterContext'

export function basicFieldsAdapter(state) {
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
        case 'switch':
        case 'card-switch':
            return wrap(<Switch disabled={disabled} size="small" />, {
                valuePropName: 'checked',
            })

        case 'money':
        case 'number_formatter':
            return wrap(
                <BaseNumberFormatter
                    disabled={disabled}
                    unit={unit}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
                    stringMode={
                        field.stringMode === true ||
                        field.valueMode === 'decimal-string'
                    }
                />,
            )

        case 'textarea':
            return wrap(
                <Input.TextArea
                    rows={field.rows || 4}
                    disabled={disabled}
                    value={field.value}
                    onChange={field.onChange}
                    {...commonInput}
                />,
            )

        case 'template': {
            const tokens = normalizeOptions(
                resolve(field.tokens, {
                    field,
                    row: __row,
                    listIndex: __listIndex,
                }),
            )
            const appendToken = (token, editor = null) => {
                if (editor) {
                    editor.chain().focus().insertContent(token).run()
                    return
                }

                const current = field.value || ''

                field.onChange?.(
                    `${current}${current && !current.endsWith(' ') ? ' ' : ''}${token}`,
                )
            }
            const tokenPicker = (editor = null) =>
                tokens.length ? (
                    <Select
                        showSearch
                        optionFilterProp="label"
                        popupMatchSelectWidth={240}
                        placeholder="Chèn field"
                        options={tokens}
                        value={undefined}
                        onSelect={(token) => appendToken(token, editor)}
                        style={{ width: 180 }}
                    />
                ) : null

            if (field.textarea) {
                return wrap(
                    <Suspense fallback={null}>
                        <BaseEditor
                            disabled={disabled}
                            value={field.value}
                            minHeight={field.minHeight || 360}
                            maxHeight={field.maxHeight || 640}
                            placeholder={
                                field.placeholder || 'Nhập nội dung mẫu...'
                            }
                            toolbarExtra={(editor) => tokenPicker(editor)}
                            onChange={field.onChange}
                        />
                    </Suspense>,
                    { valuePropName: 'value', trigger: 'onChange' },
                )
            }

            return wrap(
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        disabled={disabled}
                        value={field.value}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        {...commonInput}
                    />
                    {tokenPicker()}
                </Space.Compact>,
            )
        }

        case 'editor':
            return wrap(
                <Suspense fallback={null}>
                    <BaseEditor
                        disabled={disabled}
                        value={field.value}
                        minHeight={field.minHeight}
                        maxHeight={field.maxHeight}
                        onChange={field.onChange}
                    />
                </Suspense>,
                { valuePropName: 'value', trigger: 'onChange' },
            )

        case 'password':
            return wrap(
                <Input.Password
                    prefix={getIcon(icon)}
                    disabled={disabled}
                    value={field.value}
                    onChange={field.onChange}
                    {...commonInput}
                />,
            )

        case 'checkbox':
            return wrap(
                <Checkbox
                    disabled={disabled}
                    checked={field.value}
                    onChange={(e) => field.onChange?.(e.target.checked)}
                >
                    {field.content}
                </Checkbox>,
                { valuePropName: 'checked' },
            )

        case 'number': {
            // InputNumber does not support Input/TextArea-only props. Passing
            // them through reaches the native <input> and triggers React DOM
            // warnings (for example allowClear/showCount).
            const {
                allowClear: _allowClear,
                showCount: _showCount,
                ...numberProps
            } = field.props || {}

            return wrap(
                <InputNumber
                    {...common}
                    disabled={disabled}
                    min={field.min}
                    max={field.max}
                    precision={field.precision}
                    value={field.value}
                    onChange={field.onChange}
                    {...numberProps}
                />,
            )
        }

        case 'number-range': {
            const NumberRangeInput = ({ value = [], onChange }) => (
                <Space.Compact style={{ width: '100%' }}>
                    <InputNumber
                        style={{ width: '50%' }}
                        disabled={disabled}
                        min={field.min}
                        max={field.max}
                        precision={field.precision}
                        placeholder={field.placeholder?.[0] || 'Từ giá trị'}
                        value={Array.isArray(value) ? value[0] : undefined}
                        onChange={(next) => {
                            const current = Array.isArray(value) ? value : []
                            onChange?.([next, current[1]])
                        }}
                        {...field.props}
                    />
                    <InputNumber
                        style={{ width: '50%' }}
                        disabled={disabled}
                        min={field.min}
                        max={field.max}
                        precision={field.precision}
                        placeholder={field.placeholder?.[1] || 'Đến giá trị'}
                        value={Array.isArray(value) ? value[1] : undefined}
                        onChange={(next) => {
                            const current = Array.isArray(value) ? value : []
                            onChange?.([current[0], next])
                        }}
                        {...field.props}
                    />
                </Space.Compact>
            )

            return wrap(<NumberRangeInput />)
        }

        case 'location':
            return wrap(
                <BaseLocationForm
                    {...field.props}
                    disabled={disabled}
                    value={field.value}
                    onChange={field.onChange}
                />,
            )

        default:
            return wrap(
                <Input
                    prefix={getIcon(icon)}
                    disabled={disabled}
                    value={field.value}
                    onChange={(e) => field.onChange?.(e.target.value)}
                    {...commonInput}
                />,
            )
    }
}
