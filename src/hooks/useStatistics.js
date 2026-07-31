import { useCallback, useEffect, useMemo, useState } from 'react'

export function useStatistics(service, params = {}, enabled = true) {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const paramsKey = useMemo(() => JSON.stringify(params || {}), [params])

    const reload = useCallback(async () => {
        if (!enabled || typeof service?.getStatistics !== 'function') return {}
        setLoading(true)
        setError(null)
        try {
            const response = await service.getStatistics(JSON.parse(paramsKey))
            const next =
                response?.data?.data ?? response?.data ?? response ?? {}
            setData(next)
            return next
        } catch (nextError) {
            setError(nextError)
            throw nextError
        } finally {
            setLoading(false)
        }
    }, [enabled, paramsKey, service])

    useEffect(() => {
        reload().catch(() => {})
    }, [reload])
    return { data, loading, error, reload }
}
