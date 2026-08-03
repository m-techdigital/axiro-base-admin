import {
    getValueAtPath,
    hasValueAtPath,
    resolveHidden,
    setValueAtPath,
} from './formUtils'

export const buildSubmitPayload = ({
    fields = [],
    values = {},
    record,
    form,
}) => {
    if (!fields.length) return values

    const payload = {}

    fields.forEach((field) => {
        const key = field.name
        if (!key || field.submit === false) return

        if (
            !field.submitWhenHidden &&
            resolveHidden(field, record, values, form)
        ) {
            return
        }

        if (!hasValueAtPath(values, key)) return

        const value = getValueAtPath(values, key)

        if (field.omitWhenEmpty && (value === '' || value === undefined)) {
            return
        }

        const transformedValue =
            typeof field.submitTransform === 'function'
                ? field.submitTransform(value, { values, form, record })
                : value

        if (field.omitWhenEmpty && transformedValue === undefined) {
            return
        }

        if (typeof field.submitTransform === 'function') {
            setValueAtPath(payload, key, transformedValue)
            return
        }

        if (value === '' || value === undefined) {
            setValueAtPath(payload, key, null)
            return
        }

        if (field.type === 'date' && value?.format) {
            setValueAtPath(payload, key, value.format('YYYY-MM-DD'))
            return
        }

        if (field.type === 'upload' || field.type === 'image-upload') {
            const ids = Array.isArray(value)
                ? value
                      .filter(Boolean)
                      .map((file) => file?.id)
                      .filter(Boolean)
                : []

            setValueAtPath(payload, key, ids)
            return
        }

        setValueAtPath(payload, key, transformedValue)
    })

    return payload
}
