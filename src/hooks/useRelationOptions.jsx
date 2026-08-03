import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { getListData } from '@/utils/apiAdapter'
import { getModuleAction } from './useModule'

// Cache dùng chung giữa các instance
const cache = {}
const inflight = {}
const resolved = {}
const FORCE_REFRESH_KEYS = new Set()

// =========================
// ADDED: shared request cache (FIX DUPLICATE CALL)
// =========================
const sharedCache = {}
const sharedInflight = {}

const requestVersionMap = {}

// Kiểm tra params đã đủ dữ liệu chưa
const isDepsReady = (params = {}) =>
    Object.values(params).every(
        (v) => v !== undefined && v !== null && v !== '',
    )

// Chuyển data API -> option select
const mapOptions = (
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

const buildOptions = (data, valueKey, labelKey, source) =>
    mapOptions(getListData(data), valueKey || 'id', labelKey || 'name', source)

const resolveFallbackOptions = (source = {}, record = null, values = {}) => {
    const fallback =
        typeof source.fallbackOptions === 'function'
            ? source.fallbackOptions({ record, values })
            : source.fallbackOptions

    return (
        Array.isArray(fallback) ? fallback : fallback ? [fallback] : []
    ).filter((option) => option?.value !== undefined && option?.value !== null)
}

const mergeOptions = (primary = [], fallback = []) => {
    const seen = new Set()
    return [...fallback, ...primary].filter((option) => {
        const key = String(option?.value)
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

const shallowEqual = (a = {}, b = {}) => {
    const ak = Object.keys(a)
    const bk = Object.keys(b)

    if (ak.length !== bk.length) return false

    for (const k of ak) {
        if (a[k] !== b[k]) return false
    }

    return true
}

const normalizeParams = (params) => {
    if (params === undefined || params === null) return {}
    if (typeof params !== 'object') return { value: params }

    return params
}

const getFieldValue = (values = {}, fieldName) => {
    if (!fieldName) return undefined
    if (Array.isArray(fieldName)) {
        return fieldName.reduce((current, key) => current?.[key], values)
    }
    return values?.[fieldName]
}

const withSelectedParam = (params, config, values, record, source = {}) => {
    const normalized = { ...normalizeParams(params) }

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

const hasRequiredParams = (params = {}, source = {}) =>
    (source.requiredParams || []).every((key) => {
        const value = params?.[key]
        return value !== undefined && value !== null && value !== ''
    })

const buildKey = (module, method, fieldKey, recordId, params) => {
    const normalizedParams = normalizeParams(params)
    const normalized = Object.keys(normalizedParams)
        .sort()
        .reduce((acc, key) => {
            acc[key] = normalizedParams[key]
            return acc
        }, {})

    const sharedKey = normalizedParams?.keyRelation || fieldKey

    return `${module}.${method}:${sharedKey}:${recordId || 'global'}:${JSON.stringify(normalized)}`
}

// =========================
// ADDED: source-level cache key (FIX DUPLICATE REQUEST ACROSS FIELDS)
// =========================
const getFunctionSignature = (fn) => {
    if (typeof fn !== 'function') return ''
    return fn.name || String(fn)
}

const buildSourceKey = (module, method, params, source = {}, fieldKey = '') => {
    const normalizedParams = normalizeParams(params)
    const normalized = Object.keys(normalizedParams)
        .sort()
        .reduce((acc, key) => {
            acc[key] = normalizedParams[key]
            return acc
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
        source.shareCache === true
            ? source.cacheNamespace || ''
            : source.cacheNamespace || source.cacheKey || fieldKey || ''

    return `${module}.${method}:${cacheNamespace}:${mapSignature}:${JSON.stringify(normalized)}`
}

const buildConfigSignature = (configs = []) =>
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

// Hỗ trợ source động
const resolveSource = (source, record, form, values = {}) => {
    if (typeof source === 'function') {
        return source(record, {
            values,
            record,
            form,
        })
    }

    return source
}

// Context chuẩn dùng nhiều nơi
const buildContext = (values, record, form, ctx) => ({
    values: values || form?.getFieldsValue?.(true) || {},
    record,
    form,
    ctx,
})

const forceInvalidate = (cacheKey) => {
    FORCE_REFRESH_KEYS.add(cacheKey)

    delete cache[cacheKey]
    delete resolved[cacheKey]
    delete inflight[cacheKey]
    delete requestVersionMap[cacheKey]
}

const defaultLegacyLabel = (item) => item.name || item.code

const useLegacyRelationOptions = (service, label = defaultLegacyLabel) => {
    const labelRef = useRef(label)
    const [legacyOptions, setLegacyOptions] = useState([])
    const [loading, setLoading] = useState(Boolean(service?.list))

    useEffect(() => {
        labelRef.current = label
    }, [label])

    useEffect(() => {
        if (!service?.list) {
            setLegacyOptions([])
            setLoading(false)
            return undefined
        }

        let active = true

        setLoading(true)
        service
            .list({ per_page: 100 })
            .then((response) => {
                if (!active) return

                setLegacyOptions(
                    getListData(response).map((item) => ({
                        value: item.id,
                        label: labelRef.current(item),
                        record: item,
                        raw: item,
                    })),
                )
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [service])

    return { options: legacyOptions, loading }
}

export function useRelationOptions(
    configsOrService = [],
    form,
    record = null,
    context = {},
) {
    const isLegacyService = !Array.isArray(configsOrService)
    const configs = useMemo(
        () => (isLegacyService ? [] : configsOrService),
        [configsOrService, isLegacyService],
    )
    const legacy = useLegacyRelationOptions(
        isLegacyService ? configsOrService : null,
        isLegacyService ? form : defaultLegacyLabel,
    )
    const [options, setOptions] = useState({})

    const instanceRef = useRef(null)
    const lastParamsRef = useRef({})
    const valuesRef = useRef(null)
    const cascadeVersionRef = useRef(0)
    const configsRef = useRef(configs)
    const contextRef = useRef(context)
    const configSignature = useMemo(
        () => buildConfigSignature(configs),
        [configs],
    )

    useEffect(() => {
        configsRef.current = configs
    }, [configs])

    useEffect(() => {
        instanceRef.current = `${Date.now()}-${Math.random()}`

        lastParamsRef.current = {}
        valuesRef.current = null
    }, [configSignature])

    useEffect(() => {
        contextRef.current = context
    }, [context])

    const getResolvedSource = useCallback(
        (config, values) =>
            resolveSource(
                config?.source,
                record,
                form,
                values || form?.getFieldsValue?.(true) || {},
            ),
        [form, record],
    )

    const resolveParams = useCallback((params, ctx = {}) => {
        if (!params) return {}

        if (typeof params === 'function') {
            return params(ctx) || {}
        }

        const result = {}
        const { values = {} } = ctx

        const isEmpty = (value) =>
            value === undefined || value === null || value === ''

        Object.entries(params).forEach(([key, value]) => {
            let resolved = value

            if (typeof value === 'function') {
                resolved = value(ctx)
            } else if (typeof value === 'string' && value.startsWith('@')) {
                resolved = values?.[value.slice(1)]
            } else if (typeof value === 'string' && value.startsWith('$')) {
                resolved = values?.[value.slice(1)]
            }

            if (!isEmpty(resolved)) {
                result[key] = resolved
            }
        })

        return result
    }, [])

    // Request có cache + inflight
    const fetchOptions = useCallback(
        async ({
            cacheKey,
            module,
            method,
            params,
            valueKey,
            labelKey,
            source,
            fieldKey,
        }) => {
            const isForce = FORCE_REFRESH_KEYS.has(cacheKey)

            // =========================
            // FORCE INVALIDATE
            // =========================
            if (isForce) {
                delete cache[cacheKey]
                delete resolved[cacheKey]
                delete inflight[cacheKey]
                FORCE_REFRESH_KEYS.delete(cacheKey)
            }

            const fn = getModuleAction(module, method)

            if (!fn) {
                return []
            }

            // =========================
            // ADDED: shared dedupe key
            // =========================
            const sourceKey = buildSourceKey(
                module,
                method,
                params,
                source,
                fieldKey,
            )

            if (!isForce && sharedCache[sourceKey]) {
                resolved[cacheKey] = sharedCache[sourceKey]
                cache[cacheKey] = sharedCache[sourceKey]
                return sharedCache[sourceKey]
            }

            if (!isForce && sharedInflight[sourceKey]) {
                return sharedInflight[sourceKey]
            }

            const requestVersion = Date.now() + Math.random()
            requestVersionMap[cacheKey] = requestVersion

            if (!isForce && resolved[cacheKey]) {
                return resolved[cacheKey]
            }

            if (!isForce && inflight[cacheKey]) {
                return inflight[cacheKey]
            }

            if (!isForce && cache[cacheKey]) {
                resolved[cacheKey] = cache[cacheKey]
                return cache[cacheKey]
            }

            inflight[cacheKey] = sharedInflight[sourceKey] = (async () => {
                try {
                    const response = await fn(params)

                    const mapped = buildOptions(
                        response,
                        valueKey,
                        labelKey,
                        source,
                    )

                    // shared write
                    sharedCache[sourceKey] = mapped

                    if (requestVersionMap[cacheKey] !== requestVersion) {
                        return mapped
                    }

                    cache[cacheKey] = mapped
                    resolved[cacheKey] = mapped

                    return mapped
                } finally {
                    delete inflight[cacheKey]
                    delete sharedInflight[sourceKey]
                }
            })()

            return inflight[cacheKey]
        },
        [],
    )

    // Load các source tĩnh
    useEffect(() => {
        const activeConfigs = configsRef.current || []

        if (!activeConfigs.length) return

        const run = async () => {
            const updates = {}

            for (const config of activeConfigs) {
                const key = config.key || config.name

                const source = getResolvedSource(config)

                if (!source) {
                    updates[key] = []
                    continue
                }

                const { module, method, valueKey, labelKey } = source

                // Dynamic source sẽ xử lý ở cascade
                if (source?.params) {
                    continue
                }

                const currentValues = form?.getFieldsValue?.(true) || {}
                const params = withSelectedParam(
                    {},
                    config,
                    currentValues,
                    record,
                    source,
                )
                const cacheKey = buildKey(
                    module,
                    method,
                    key,
                    record?.id,
                    params,
                )

                if (cache[cacheKey] && !FORCE_REFRESH_KEYS.has(cacheKey)) {
                    updates[key] = cache[cacheKey]
                    continue
                }

                const result = await fetchOptions({
                    cacheKey,
                    module,
                    method,
                    params,
                    valueKey,
                    labelKey,
                    source,
                    fieldKey: key,
                })

                updates[key] = mergeOptions(
                    result,
                    resolveFallbackOptions(source, record, currentValues),
                )
            }

            setOptions((prev) => ({
                ...prev,
                ...updates,
            }))
        }

        run()
    }, [configSignature, form, record, fetchOptions, getResolvedSource])

    const loadOptions = useCallback(
        async (config, ctx = {}) => {
            const values = ctx.values || form?.getFieldsValue?.(true) || {}

            const source = getResolvedSource(config, values)

            if (!source) return []

            const { module, method, valueKey, labelKey } = source

            const fieldKey = config.key || config.name

            const params = withSelectedParam(
                resolveParams(
                    source?.params,
                    buildContext(values, record, form, contextRef.current),
                ),
                config,
                values,
                record,
                source,
            )

            if (!hasRequiredParams(params, source)) return []

            const cacheKey = buildKey(
                module,
                method,
                fieldKey,
                record?.id,
                params,
            )

            const shouldForce = source?.reload === true

            if (shouldForce) {
                forceInvalidate(cacheKey)
            }

            const result = mergeOptions(
                await fetchOptions({
                    cacheKey,
                    module,
                    method,
                    params,
                    valueKey,
                    labelKey,
                    source,
                    fieldKey,
                }),
                resolveFallbackOptions(source, record, values),
            )

            setOptions((prev) => ({
                ...prev,
                [fieldKey]: result,
            }))

            return result
        },
        [form, record, resolveParams, fetchOptions, getResolvedSource],
    )

    const runCascade = useCallback(
        async (values) => {
            const activeConfigs = configsRef.current || []

            if (!activeConfigs.length) return

            const cascadeVersion = ++cascadeVersionRef.current
            const updates = {}
            const instanceKey = instanceRef.current

            if (!lastParamsRef.current[instanceKey]) {
                lastParamsRef.current[instanceKey] = {}
            }

            for (const config of activeConfigs) {
                const key = config.key || config.name
                const source = getResolvedSource(config, values)

                if (!source) {
                    updates[key] = []
                    continue
                }

                const params = withSelectedParam(
                    resolveParams(
                        source.params,
                        buildContext(values, record, form, contextRef.current),
                    ),
                    config,
                    values,
                    record,
                    source,
                )
                const hasDynamicSource = typeof config.source === 'function'

                if (!source.params && !hasDynamicSource) {
                    continue
                }

                if (
                    (source.params && !isDepsReady(params)) ||
                    !hasRequiredParams(params, source)
                ) {
                    updates[key] = []
                    continue
                }

                const compareValue = {
                    ...normalizeParams(params),
                    __module: source.module,
                    __method: source.method,
                }
                const previousParams = lastParamsRef.current[instanceKey][key]
                const cacheKey = buildKey(
                    source.module,
                    source.method,
                    key,
                    record?.id,
                    params,
                )
                const shouldForce = source?.reload === true
                const isForce = FORCE_REFRESH_KEYS.has(cacheKey)
                const paramsChanged =
                    !previousParams ||
                    !shallowEqual(previousParams, compareValue)

                if (!isForce && !paramsChanged) {
                    continue
                }

                lastParamsRef.current[instanceKey][key] = compareValue

                if (isForce || (shouldForce && paramsChanged)) {
                    forceInvalidate(cacheKey)
                }

                try {
                    updates[key] = mergeOptions(
                        await fetchOptions({
                            cacheKey,
                            module: source.module,
                            method: source.method,
                            params,
                            valueKey: source.valueKey,
                            labelKey: source.labelKey,
                            source,
                            fieldKey: key,
                        }),
                        resolveFallbackOptions(source, record, values),
                    )
                } catch {
                    updates[key] = []
                }
            }

            // A slower, older request must not overwrite newer form values.
            if (
                cascadeVersion === cascadeVersionRef.current &&
                Object.keys(updates).length > 0
            ) {
                setOptions((previousOptions) => ({
                    ...previousOptions,
                    ...updates,
                }))
            }
        },
        [form, record, resolveParams, fetchOptions, getResolvedSource],
    )

    useEffect(() => {
        const activeConfigs = configsRef.current || []

        if (!form || !activeConfigs.length) return

        const values = form.getFieldsValue(true)

        const snapshot = JSON.stringify(values)

        if (valuesRef.current === snapshot) {
            return
        }

        valuesRef.current = snapshot

        runCascade(values)
    }, [form, configSignature, runCascade])

    const relationState = {
        relationOptions: options,
        loadOptions,
        runCascade,
    }

    return isLegacyService ? legacy : relationState
}
