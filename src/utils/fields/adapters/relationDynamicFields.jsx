import {
    fieldComponents,
    getIcon,
    normalizeOptions,
    getRelationKey,
} from './fieldAdapterContext'

export function relationDynamicFieldsAdapter(state) {
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
        relationKey,
        wrap,
        resolve,
        resolveDependentOptions,
        __row,
        __listIndex,
        icon,
        renderField,
    } = state
    const {
        dayjs,
        Suspense,
        Form,
        Col,
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
        case 'relation': {
            const loadedRelationOpts = relationOptions?.[relationKey] || []
            const fallbackRelationOpts = (() => {
                const fallback = source?.fallbackOptions
                const list =
                    typeof fallback === 'function'
                        ? fallback({ record, values: ctx.values })
                        : fallback
                return normalizeOptions(
                    Array.isArray(list) ? list : list ? [list] : [],
                    source || {},
                )
            })()
            const seenRelationValues = new Set()
            const relationOpts = [
                ...fallbackRelationOpts,
                ...loadedRelationOpts,
            ].filter((option) => {
                const key = String(option?.value)
                if (seenRelationValues.has(key)) return false
                seenRelationValues.add(key)
                return true
            })

            const handleOpen = (open) => {
                if (!open) return
                const cfg = relationConfigs.find(
                    (c) => c.key === relationKey || c.name === relationKey,
                )
                if (!cfg) return

                const resolvedSource = resolve(cfg.source) || {}

                loadOptions(
                    { ...cfg, source: resolvedSource },
                    { values: ctx.values, record, form },
                )
            }

            return wrap(
                <RelationSelect
                    field={{
                        ...field,
                        label,
                        source: {
                            ...source,
                            valueKey: source?.valueKey,
                            labelKey: source?.labelKey,
                        },
                    }}
                    options={normalizeOptions(relationOpts, source || {})}
                    form={form}
                    loadOptions={loadOptions}
                    disabled={disabled}
                    trigger="open"
                    onOpenChange={handleOpen}
                    {...commonRelation}
                />,
            )
        }

        case 'dynamic-list':
            return wrap(
                <BaseListInput
                    {...field.props}
                    value={field.value}
                    onChange={field.onChange}
                    errors={normalizeDynamicListErrors(serverErrors, name)}
                />,
            )

        case 'dynamic-form-list':
            return (
                <Col
                    key={name}
                    {...(typeof (field.span ?? field.col) === 'object'
                        ? (field.span ?? field.col)
                        : { span: field.span ?? field.col ?? 24 })}
                >
                    <Form.Item
                        name={name}
                        label={label}
                        extra={field.extra}
                        help={serverErrors?.[name]}
                        validateStatus={
                            serverErrors?.[name] ? 'error' : undefined
                        }
                    >
                        <BaseDynamicFormList
                            name={name}
                            values={values}
                            fields={field.props?.fields || []}
                            defaultItem={field.props?.defaultItem || {}}
                            addDisabled={field.props?.addDisabled}
                            addText={field.props?.addText || 'Thêm'}
                            variant={field.props?.variant}
                            layout={field.props?.layout}
                            gridMinWidth={field.props?.gridMinWidth}
                            removePlacement={field.props?.removePlacement}
                            renderField={(subField) => renderField(subField)}
                        />
                    </Form.Item>
                </Col>
            )
    }
}
