export const normalizeDynamicListErrors = (errors, fieldName) => {
    const result = {}

    Object.entries(errors || {}).forEach(([key, messages]) => {
        // chỉ lấy field liên quan
        if (!key.startsWith(fieldName + '.')) return

        const parts = key.split('.')

        // phone_notes.0.phone
        const index = Number(parts[1])
        const field = parts.slice(2).join('.')

        if (!result[index]) result[index] = {}

        result[index][field] = Array.isArray(messages) ? messages[0] : messages
    })

    return result
}
