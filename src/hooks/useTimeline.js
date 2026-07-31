import { useCallback, useEffect, useMemo, useState } from 'react'

export function useTimeline(
    id,
    service,
    { method = 'getTimeline', immediate = true, params = {} } = {},
) {
    const [timeline, setTimeline] = useState([])
    const [loading, setLoading] = useState(false)
    const [meta, setMeta] = useState({})
    const paramsKey = useMemo(() => JSON.stringify(params || {}), [params])

    const fetch = useCallback(
        async (page = 1, perPage = 10) => {
            if (!id || typeof service?.[method] !== 'function') return []
            setLoading(true)
            try {
                const response = await service[method](id, {
                    ...JSON.parse(paramsKey),
                    page,
                    per_page: perPage,
                })
                const next = response?.data?.data ?? response?.data ?? []
                setTimeline(Array.isArray(next) ? next : [])
                setMeta(response?.meta || response?.data?.meta || {})
                return next
            } finally {
                setLoading(false)
            }
        },
        [id, method, paramsKey, service],
    )

    useEffect(() => {
        if (immediate) fetch().catch(() => {})
    }, [fetch, immediate])
    return { timeline, loading, meta, fetch }
}
