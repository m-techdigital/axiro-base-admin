import { useCallback, useEffect, useState } from 'react'
import { useServiceOverview } from './useServiceOverview'

export function useModulePageData({
    service,
    overviewMethod = 'dashboard',
    optionsMethod = 'options',
    initialOverview = {},
    initialOptions = {},
    immediate = true,
} = {}) {
    const [options, setOptions] = useState(initialOptions)
    const overviewState = useServiceOverview({
        service,
        method: overviewMethod,
        initialData: initialOverview,
        immediate,
    })
    const loadOptions = useCallback(async () => {
        if (typeof service?.[optionsMethod] !== 'function')
            return initialOptions
        const response = await service[optionsMethod]()
        const next =
            response?.data?.data ?? response?.data ?? response ?? initialOptions
        setOptions(next)
        return next
    }, [initialOptions, optionsMethod, service])
    useEffect(() => {
        if (immediate) loadOptions().catch(() => {})
    }, [immediate, loadOptions])
    return {
        options,
        setOptions,
        overview: overviewState.data,
        setOverview: overviewState.setData,
        overviewLoading: overviewState.loading,
        loadOverview: overviewState.refetch,
        loadOptions,
    }
}
