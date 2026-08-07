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
    const payload = {}

    fields.forEach((field) => {
        const key = field.name
        if (!key) return

        if (field.submit === false) {
            return
        }

        if (
            !field.submitWhenHidden &&
            resolveHidden(field, record, values, form)
        ) {
            return
        }

        if (!hasValueAtPath(values, key)) {
            return
        }

        const value = getValueAtPath(values, key)

        if (value === '' || value === undefined) {
            setValueAtPath(payload, key, null)
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

        const transformedValue =
            typeof field.submitTransform === 'function'
                ? field.submitTransform(value, {
                      values,
                      form,
                      record,
                  })
                : value

        setValueAtPath(payload, key, transformedValue)
    })

    return payload
}
