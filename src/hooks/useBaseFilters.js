import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { compactParams, normalizePaginationParams } from '@/utils'

export function useBaseFilters({
    defaultParams = {},
    onSearch,
    onChange,
    onReset,
} = {}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const defaults = useMemo(
        () => normalizePaginationParams(defaultParams),
        [defaultParams],
    )
    const initial = useMemo(
        () =>
            normalizePaginationParams({
                ...defaults,
                ...Object.fromEntries(searchParams.entries()),
            }),
        [defaults, searchParams],
    )
    const [filters, setFilters] = useState(initial)

    const sync = useCallback(
        (next) => {
            const params = new URLSearchParams()

            Object.entries(compactParams(next)).forEach(([key, value]) => {
                params.set(key, String(value))
            })

            setSearchParams(params, { replace: true })
        },
        [setSearchParams],
    )

    const commit = useCallback(
        (next, callback) => {
            const normalized = normalizePaginationParams(next)
            setFilters(normalized)
            sync(normalized)
            callback?.(normalized)

            return normalized
        },
        [sync],
    )

    const search = useCallback(
        (values = {}) => commit({ ...filters, ...values, page: 1 }, onSearch),
        [commit, filters, onSearch],
    )

    const change = useCallback(
        (values = {}) => commit({ ...filters, ...values, page: 1 }, onChange),
        [commit, filters, onChange],
    )

    const paginate = useCallback(
        (page, perPage = filters.per_page) =>
            commit({ ...filters, page, per_page: perPage }, onSearch),
        [commit, filters, onSearch],
    )

    const reset = useCallback(
        () => commit({ ...defaults, page: 1 }, onReset),
        [commit, defaults, onReset],
    )

    return {
        filters,
        setFilters,
        search,
        change,
        paginate,
        reset,
    }
}
