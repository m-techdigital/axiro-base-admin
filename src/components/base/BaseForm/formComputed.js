import { useEffect } from 'react'

const resolveHidden = ({ field, record, values, form, row, rowIndex }) => {
    if (typeof field.hidden !== 'function') {
        return field.hidden
    }

    return field.hidden(record, {
        values,
        record,
        form,
        row,
        rowIndex,
    })
}

const applyComputedField = ({
    field,
    record,
    values,
    form,
    path,
    row,
    rowIndex,
}) => {
    if (typeof field.compute !== 'function') return

    const nextValue = field.compute(record, {
        values,
        record,
        form,
        row,
        rowIndex,
    })

    const currentValue = form.getFieldValue(path)

    if (currentValue !== nextValue) {
        form.setFieldValue(path, nextValue)
    }
}

export const useComputedFields = ({ fields, values, form, record }) => {
    useEffect(() => {
        fields.forEach((field) => {
            const isHidden = resolveHidden({ field, record, values, form })
            if (isHidden) return

            applyComputedField({
                field,
                record,
                values,
                form,
                path: field.name,
            })

            if (field.type !== 'dynamic-form-list') return

            const rows = form.getFieldValue(field.name) || []

            rows.forEach((row, index) => {
                field.props?.fields?.forEach((subField) => {
                    const subHidden = resolveHidden({
                        field: subField,
                        record,
                        values,
                        form,
                        row,
                        rowIndex: index,
                    })

                    if (subHidden) return

                    applyComputedField({
                        field: subField,
                        record,
                        values,
                        form,
                        path: [field.name, index, subField.name],
                        row,
                        rowIndex: index,
                    })
                })
            })
        })
    }, [values, fields, form, record])
}
