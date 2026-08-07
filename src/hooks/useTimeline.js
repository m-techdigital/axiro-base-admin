import { useCallback, useEffect, useState } from 'react'

export const useTimeline = (
    id,
    service,
    { method = 'getTimeline', immediate = true, params = {} } = {},
) => {
    const [timeline, setTimeline] = useState([])
    const [loading, setLoading] = useState(false)
    const [responseMeta, setResponseMeta] = useState({})

    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        total: 0,
        lastPage: 1,
    })

    const normalize = (res) => {
        const data = res?.data?.data ?? res?.data ?? res ?? []

        return Array.isArray(data) ? data : []
    }
    const meta = (res) => res?.meta?.pagination

    const paramsKey = JSON.stringify(params || {})

    const fetch = useCallback(
        async (page = 1, perPage = pagination.perPage, extraParams = {}) => {
            if (!id) return

            const fn = service?.[method]
            if (typeof fn !== 'function') return

            setLoading(true)

            try {
                const baseParams = paramsKey ? JSON.parse(paramsKey) : {}
                const res = await fn(id, {
                    ...baseParams,
                    ...(extraParams || {}),
                    page,
                    limit: perPage,
                })

                setTimeline(normalize(res))
                setResponseMeta(res?.meta ?? {})

                const p = meta(res)

                setPagination({
                    page: p?.current_page ?? page,
                    perPage: p?.per_page ?? perPage,
                    total: p?.total ?? 0,
                    lastPage: p?.last_page ?? 1,
                })
            } finally {
                setLoading(false)
            }
        },
        [id, service, method, pagination.perPage, paramsKey],
    )

    useEffect(() => {
        if (!immediate || !id) return
        fetch(1, pagination.perPage)
    }, [fetch, id, immediate, pagination.perPage])

    return {
        timeline,
        loading,
        pagination,
        meta: responseMeta,
        fetch,
    }
}
