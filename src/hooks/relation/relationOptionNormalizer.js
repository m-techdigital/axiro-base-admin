import { getListData } from '@/utils/apiAdapter'

export const mapRelationOptions = (
    list = [],
    valueKey = 'id',
    labelKey = 'name',
    source = {},
) =>
    (list || []).map((item) => ({
        value: item?.[valueKey],
        label: source.labelFormatter
            ? source.labelFormatter({
                  value: item?.[valueKey],
                  label: item?.[labelKey],
                  raw: item,
              })
            : item?.[labelKey],
        disabled: source.disabledFormatter
            ? source.disabledFormatter(item)
            : false,
        searchText: source.searchFormatter
            ? source.searchFormatter(item)
            : String(item?.[labelKey] ?? ''),
        raw: item,
    }))

export const buildRelationOptions = (data, valueKey, labelKey, source) =>
    mapRelationOptions(
        getListData(data),
        valueKey || 'id',
        labelKey || 'name',
        source,
    )

export const resolveFallbackOptions = (
    source = {},
    record = null,
    values = {},
) => {
    const fallback =
        typeof source.fallbackOptions === 'function'
            ? source.fallbackOptions({ record, values })
            : source.fallbackOptions

    return (
        Array.isArray(fallback) ? fallback : fallback ? [fallback] : []
    ).filter((option) => option?.value !== undefined && option?.value !== null)
}

export const mergeRelationOptions = (primary = [], fallback = []) => {
    const seen = new Set()
    return [...fallback, ...primary].filter((option) => {
        const key = String(option?.value)
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}
