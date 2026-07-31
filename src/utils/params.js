export const compactParams = (params = {}) =>
    Object.fromEntries(
        Object.entries(params).filter(([, value]) => {
            if (value === undefined || value === null || value === '') {
                return false
            }

            if (Array.isArray(value)) {
                return value.length > 0
            }

            return true
        }),
    )

export const normalizePaginationParams = (params = {}) => ({
    ...params,
    page: Math.max(1, Number(params.page || 1)),
    per_page: Math.min(100, Math.max(1, Number(params.per_page || 20))),
})
