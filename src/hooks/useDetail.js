import { useCallback, useEffect, useRef, useState } from 'react'
export function useDetail(service, id, options = {}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(Boolean(id))
    const [error, setError] = useState(null)
    const requestRef = useRef(0)
    const load = useCallback(async () => {
        if (!id) {
            setData(null)
            setLoading(false)
            return null
        }
        const requestId = ++requestRef.current
        setLoading(true)
        setError(null)
        try {
            const response = await service.get(id)
            if (requestId === requestRef.current) setData(response.data)
            return response
        } catch (nextError) {
            if (requestId === requestRef.current) setError(nextError)
            throw nextError
        } finally {
            if (requestId === requestRef.current) setLoading(false)
        }
    }, [service, id])
    useEffect(() => {
        if (options.immediate !== false) load().catch(() => {})
    }, [load, options.immediate])
    return { data, loading, error, reload: load }
}
