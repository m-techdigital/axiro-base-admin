import { useCallback, useEffect, useState } from 'react'

export function useServiceOverview({
    service,
    method = 'dashboard',
    immediate = true,
    initialData = {},
    errorMessage = 'Không tải được dữ liệu tổng quan',
} = {}) {
    const [data, setData] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const refetch = useCallback(
        async (params = {}) => {
            if (typeof service?.[method] !== 'function') return initialData
            setLoading(true)
            setError(null)
            try {
                const response = await service[method](params)
                const next =
                    response?.data?.data ??
                    response?.data ??
                    response ??
                    initialData
                setData(next)
                return next
            } catch (nextError) {
                setError(nextError?.message || errorMessage)
                throw nextError
            } finally {
                setLoading(false)
            }
        },
        [errorMessage, initialData, method, service],
    )
    useEffect(() => {
        if (immediate) refetch().catch(() => {})
    }, [immediate, refetch])
    return { data, setData, loading, error, refetch }
}
