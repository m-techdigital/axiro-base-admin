/**
 * Convert Laravel validation errors:
 * {
 *   username: ["The username has already been taken."]
 * }
 *
 * -> Ant Design format:
 * [
 *   { name: "username", errors: ["..."] }
 * ]
 */
export const mapLaravelErrorsToFields = (errors) => {
    if (!errors) return []

    return Object.entries(errors).map(([field, messages]) => ({
        name:
            typeof field === 'string' && field.includes('.')
                ? field.split('.')
                : field,
        errors: Array.isArray(messages) ? messages : [messages],
    }))
}

const getErrorPayload = (error) => error?.response?.data || error?.data || {}

export const getLaravelValidationError = (error) => {
    const responseData = getErrorPayload(error)
    const status =
        error?.status || error?.response?.status || responseData?.status?.code
    const errors = error?.errors || responseData?.errors

    if (Number(status) !== 422 || !errors) {
        return null
    }

    return {
        status: 422,
        errors,
        message:
            error?.message ||
            responseData?.message ||
            responseData?.status?.message,
    }
}

export const getLaravelConflictError = (error) => {
    const responseData = getErrorPayload(error)
    const status =
        error?.status || error?.response?.status || responseData?.status?.code

    if (Number(status) !== 409) return null

    return {
        status: 409,
        message:
            responseData?.message ||
            responseData?.status?.message ||
            error?.message ||
            'Dữ liệu đã thay đổi. Vui lòng tải lại.',
        conflict: responseData?.conflict || null,
        errors: error?.errors || responseData?.errors || null,
    }
}
