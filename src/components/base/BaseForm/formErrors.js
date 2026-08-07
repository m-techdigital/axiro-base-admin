export const buildFormErrorMessages = ({ fields = [], serverErrors = {} }) => {
    const entries = Object.entries(serverErrors || {})
    if (!entries.length) return []

    const fieldNames = new Set(
        fields
            .map((field) => field?.name)
            .filter(Boolean)
            .map((name) =>
                Array.isArray(name) ? name.join('.') : String(name),
            ),
    )

    const isRenderedFieldError = (name) => {
        if (!name || name === '_form') return false
        if (fieldNames.has(name)) return true

        return [...fieldNames].some(
            (fieldName) =>
                name.startsWith(`${fieldName}.`) ||
                fieldName.startsWith(`${name}.`),
        )
    }

    if (entries.some(([name]) => isRenderedFieldError(name))) {
        return []
    }

    return entries.flatMap(([field, error]) => {
        const messages = Array.isArray(error) ? error : [error]

        return messages.filter(Boolean).map((item) => ({
            key: `${field}:${item}`,
            message: String(item),
        }))
    })
}
