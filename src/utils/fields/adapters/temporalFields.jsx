import {
    fieldComponents,
    getIcon,
    normalizeOptions,
    getRelationKey,
} from './fieldAdapterContext'

export function temporalFieldsAdapter(state) {
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
        case 'date': {
            const format = field.format || 'DD/MM/YYYY'
            return wrap(
                <DatePicker
                    style={{ width: '100%' }}
                    disabled={disabled}
                    format={format}
                    placeholder={field.placeholder}
                    value={
                        field.value ? dayjs(field.value, 'YYYY-MM-DD') : null
                    }
                    onChange={(date) =>
                        field.onChange?.(
                            date ? date.format('YYYY-MM-DD') : null,
                        )
                    }
                />,
                {
                    getValueProps: (value) => ({
                        value: value ? dayjs(value, 'YYYY-MM-DD') : null,
                    }),
                    getValueFromEvent: (date) =>
                        date ? date.format('YYYY-MM-DD') : null,
                },
            )
        }

        case 'datetime': {
            const format = field.format || 'DD-MM-YYYY HH:mm'
            return wrap(
                <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    disabled={disabled}
                    placeholder={field.placeholder}
                    format={format}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) =>
                        field.onChange?.(date ? date.toISOString() : null)
                    }
                />,
                {
                    getValueProps: (value) => ({
                        value: value ? dayjs(value) : null,
                    }),
                    getValueFromEvent: (date) =>
                        date ? date.toISOString() : null,
                },
            )
        }

        case 'datetime-range': {
            const format = field.format || 'DD/MM/YYYY HH:mm'
            const valueFormat = field.valueFormat || 'YYYY-MM-DD HH:mm:ss'

            return wrap(
                <DatePicker.RangePicker
                    showTime={field.showTime ?? true}
                    style={{ width: '100%' }}
                    disabled={disabled}
                    placeholder={field.placeholder || ['Bắt đầu', 'Kết thúc']}
                    format={format}
                    value={
                        Array.isArray(field.value)
                            ? field.value.map((item) =>
                                  item ? dayjs(item) : null,
                              )
                            : null
                    }
                    onChange={(dates) =>
                        field.onChange?.(
                            dates?.length
                                ? dates.map((date) =>
                                      date ? date.format(valueFormat) : null,
                                  )
                                : null,
                        )
                    }
                />,
                {
                    getValueProps: (value) => ({
                        value: Array.isArray(value)
                            ? value.map((item) => (item ? dayjs(item) : null))
                            : null,
                    }),
                    getValueFromEvent: (dates) =>
                        dates?.length
                            ? dates.map((date) =>
                                  date ? date.format(valueFormat) : null,
                              )
                            : null,
                },
            )
        }

        case 'date-range': {
            const format = field.format || 'DD/MM/YYYY'
            const valueFormat = field.valueFormat || 'YYYY-MM-DD'

            return wrap(
                <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    disabled={disabled}
                    placeholder={field.placeholder || ['Từ ngày', 'Đến ngày']}
                    format={format}
                    value={
                        Array.isArray(field.value)
                            ? field.value.map((item) =>
                                  item ? dayjs(item) : null,
                              )
                            : null
                    }
                    onChange={(dates) =>
                        field.onChange?.(
                            dates?.length
                                ? dates.map((date) =>
                                      date ? date.format(valueFormat) : null,
                                  )
                                : null,
                        )
                    }
                />,
                {
                    getValueProps: (value) => ({
                        value: Array.isArray(value)
                            ? value.map((item) => (item ? dayjs(item) : null))
                            : null,
                    }),
                    getValueFromEvent: (dates) =>
                        dates?.length
                            ? dates.map((date) =>
                                  date ? date.format(valueFormat) : null,
                              )
                            : null,
                },
            )
        }

        case 'time': {
            const format = field.format || 'HH:mm'

            return wrap(
                <TimePicker
                    style={{ width: '100%' }}
                    disabled={disabled}
                    format={format}
                    placeholder={field.placeholder}
                    value={field.value ? dayjs(field.value, format) : null}
                    onChange={(time) =>
                        field.onChange?.(time ? time.format(format) : null)
                    }
                    {...field.props}
                />,
                {
                    getValueProps: (value) => ({
                        value: value ? dayjs(value, format) : null,
                    }),
                    getValueFromEvent: (time) =>
                        time ? time.format(format) : null,
                },
            )
        }
    }
}
