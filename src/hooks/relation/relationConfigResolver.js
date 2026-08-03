export const normalizeRelationParams = (params) => {
    if (params === undefined || params === null) return {}
    if (typeof params !== 'object') return { value: params }
    return params
}

const getFunctionSignature = (fn) => {
    if (typeof fn !== 'function') return ''
    return fn.name || String(fn)
}

const getFieldValue = (values = {}, fieldName) => {
    if (!fieldName) return undefined
    if (Array.isArray(fieldName)) {
        return fieldName.reduce((current, key) => current?.[key], values)
    }
    return values?.[fieldName]
}

export const withSelectedRelationParam = (
    params,
    config,
    values,
    record,
    source = {},
) => {
    const normalized = { ...normalizeRelationParams(params) }
    if (source.includeSelected === false || normalized.selected !== undefined) {
        return normalized
    }

    const selected =
        getFieldValue(values, config?.name) ??
        getFieldValue(record || {}, config?.name)

    if (selected !== undefined && selected !== null && selected !== '') {
        normalized.selected = selected
    }

    return normalized
}

export const hasRequiredRelationParams = (params = {}, source = {}) =>
    (source.requiredParams || []).every((key) => {
        const value = params?.[key]
        return value !== undefined && value !== null && value !== ''
    })

export const buildRelationCacheKey = (
    module,
    method,
    fieldKey,
    recordId,
    params,
) => {
    const normalizedParams = normalizeRelationParams(params)
    const normalized = Object.keys(normalizedParams)
        .sort()
        .reduce((accumulator, key) => {
            accumulator[key] = normalizedParams[key]
            return accumulator
        }, {})
    const sharedKey = normalizedParams?.keyRelation || fieldKey

    return `${module}.${method}:${sharedKey}:${recordId || 'global'}:${JSON.stringify(normalized)}`
}

export const buildRelationSourceKey = (
    module,
    method,
    params,
    source = {},
    fieldKey = '',
) => {
    const normalizedParams = normalizeRelationParams(params)
    const normalized = Object.keys(normalizedParams)
        .sort()
        .reduce((accumulator, key) => {
            accumulator[key] = normalizedParams[key]
            return accumulator
        }, {})
    const mapSignature = [
        source.valueKey || 'id',
        source.labelKey || 'name',
        getFunctionSignature(source.labelFormatter),
        getFunctionSignature(source.disabledFormatter),
        getFunctionSignature(source.searchFormatter),
        getFunctionSignature(source.optionRender),
    ].join(':')
    const cacheNamespace =
        source.cacheNamespace || source.cacheKey || fieldKey || ''

    return `${module}.${method}:${cacheNamespace}:${mapSignature}:${JSON.stringify(normalized)}`
}

export const buildRelationConfigSignature = (configs = []) =>
    JSON.stringify(
        (configs || []).map((config) => {
            const isDynamicSource = typeof config?.source === 'function'
            const source = isDynamicSource ? {} : config?.source || {}

            return {
                key: config?.key || config?.name,
                name: config?.name,
                dynamicSource: isDynamicSource,
                module: source?.module,
                method: source?.method,
                valueKey: source?.valueKey,
                labelKey: source?.labelKey,
                reload: source?.reload === true,
                hasParams: Boolean(source?.params),
                params: getFunctionSignature(source?.params),
                source: getFunctionSignature(config?.source),
                labelFormatter: getFunctionSignature(source?.labelFormatter),
                disabledFormatter: getFunctionSignature(
                    source?.disabledFormatter,
                ),
                searchFormatter: getFunctionSignature(source?.searchFormatter),
                optionRender: getFunctionSignature(source?.optionRender),
            }
        }),
    )

export const resolveRelationSource = (source, record, form, values = {}) => {
    if (typeof source === 'function') {
        return source(record, { values, record, form })
    }
    return source
}

export const buildRelationContext = (values, record, form, context) => ({
    values: values || form?.getFieldsValue?.(true) || {},
    record,
    form,
    ctx: context,
})

export const areRelationDependenciesReady = (params = {}) =>
    Object.values(params).every(
        (value) => value !== undefined && value !== null && value !== '',
    )

export const shallowEqualRelationParams = (left = {}, right = {}) => {
    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)
    if (leftKeys.length !== rightKeys.length) return false
    return leftKeys.every((key) => left[key] === right[key])
}
