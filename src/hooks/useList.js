import { useCallback, useEffect, useRef, useState } from 'react'

import { getListData, getPaginationMeta } from '@/utils'

export function useList(service, initial = {}, options = {}) {
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({ pagination: {} })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [params, setParams] = useState(initial)
    const requestRef = useRef(0)
    const abortRef = useRef(null)
    const immediate = options.immediate !== false

    const load = useCallback(
        async (override = null) => {
            const requestId = ++requestRef.current
            abortRef.current?.abort()
            abortRef.current = new AbortController()
            setLoading(true)
            setError(null)

            try {
                const response = await service.list(
                    override ? { ...params, ...override } : params,
                    { signal: abortRef.current.signal },
                )

                if (requestId !== requestRef.current) {
                    return response
                }

                setData(getListData(response))
                setMeta(getPaginationMeta(response))

                return response
            } catch (nextError) {
                if (
                    nextError?.name === 'CanceledError' ||
                    nextError?.name === 'AbortError'
                ) {
                    return null
                }

                if (requestId === requestRef.current) {
                    setError(nextError)
                }

                throw nextError
            } finally {
                if (requestId === requestRef.current) {
                    setLoading(false)
                }
            }
        },
        [params, service],
    )

    useEffect(() => {
        if (immediate) {
            load().catch(() => {})
        }

        return () => abortRef.current?.abort()
    }, [immediate, load])

    return {
        data,
        meta,
        loading,
        error,
        params,
        setParams,
        reload: load,
    }
}
