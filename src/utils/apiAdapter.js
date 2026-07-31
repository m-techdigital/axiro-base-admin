export const getResponseData = (response, fallback = null) =>
    response?.data ?? response ?? fallback

export const getListData = (response) => {
    const payload = getResponseData(response, [])

    if (Array.isArray(payload)) {
        return payload
    }

    if (Array.isArray(payload?.data)) {
        return payload.data
    }

    return []
}

export const getPaginationMeta = (response) => {
    const payload = getResponseData(response, {})
    const pagination = response?.meta?.pagination ?? payload?.meta?.pagination

    if (pagination) {
        return { pagination }
    }

    if (
        payload &&
        typeof payload === 'object' &&
        ['current_page', 'last_page', 'per_page', 'total'].some(
            (key) => payload[key] !== undefined,
        )
    ) {
        return {
            pagination: {
                current_page: payload.current_page ?? 1,
                last_page: payload.last_page ?? 1,
                per_page: payload.per_page ?? 20,
                total: payload.total ?? 0,
            },
        }
    }

    return { pagination: {} }
}

export const normalizeApiError = (error) => {
    if (error?.isNormalizedApiError) {
        return error
    }

    const payload = error?.response?.data ?? {}
    const normalized = new Error(
        payload?.status?.message ?? payload?.message ?? 'Có lỗi xảy ra',
    )

    normalized.name = 'ApiError'
    normalized.isNormalizedApiError = true
    normalized.status = error?.response?.status ?? error?.status ?? null
    normalized.errors = payload?.errors ?? error?.errors ?? null
    normalized.errorCode = payload?.error_code ?? error?.errorCode ?? null
    normalized.requestId =
        payload?.meta?.request_id ??
        error?.response?.headers?.['x-request-id'] ??
        error?.requestId ??
        null
    normalized.correlationId =
        payload?.meta?.correlation_id ??
        error?.response?.headers?.['x-correlation-id'] ??
        error?.correlationId ??
        null
    normalized.cause = error

    return normalized
}
