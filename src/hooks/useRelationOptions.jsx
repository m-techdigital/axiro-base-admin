import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { getModuleAction } from './useModule'
import {
    areRelationDependenciesReady,
    buildRelationCacheKey,
    buildRelationConfigSignature,
    buildRelationContext,
    buildRelationSourceKey,
    hasRequiredRelationParams,
    normalizeRelationParams,
    resolveRelationSource,
    shallowEqualRelationParams,
    withSelectedRelationParam,
} from './relation/relationConfigResolver'
import { relationOptionCache } from './relation/relationOptionCache'
import {
    buildRelationOptions,
    mergeRelationOptions,
    resolveFallbackOptions,
} from './relation/relationOptionNormalizer'

const {
    cache,
    inflight,
    resolved,
    sharedCache,
    sharedInflight,
    requestVersions: requestVersionMap,
    forceRefreshKeys: FORCE_REFRESH_KEYS,
} = relationOptionCache

const forceInvalidate = (cacheKey) => relationOptionCache.invalidate(cacheKey)

export function useRelationOptions(
    configsOrService = [],
    form,
    record = null,
    context = {},
) {
    const configs = useMemo(
        () => (Array.isArray(configsOrService) ? configsOrService : []),
        [configsOrService],
    )
    const [options, setOptions] = useState({})

    const instanceRef = useRef(null)
    const lastParamsRef = useRef({})
    const valuesRef = useRef(null)
    const cascadeVersionRef = useRef(0)
    const configsRef = useRef(configs)
    const contextRef = useRef(context)
    const configSignature = useMemo(
        () => buildRelationConfigSignature(configs),
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
            resolveRelationSource(
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
            const sourceKey = buildRelationSourceKey(
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

                    const mapped = buildRelationOptions(
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
                const params = withSelectedRelationParam(
                    {},
                    config,
                    currentValues,
                    record,
                    source,
                )
                const cacheKey = buildRelationCacheKey(
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

                updates[key] = mergeRelationOptions(
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

            const params = withSelectedRelationParam(
                resolveParams(
                    source?.params,
                    buildRelationContext(
                        values,
                        record,
                        form,
                        contextRef.current,
                    ),
                ),
                config,
                values,
                record,
                source,
            )

            if (!hasRequiredRelationParams(params, source)) return []

            const cacheKey = buildRelationCacheKey(
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

            const result = mergeRelationOptions(
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

                const params = withSelectedRelationParam(
                    resolveParams(
                        source.params,
                        buildRelationContext(
                            values,
                            record,
                            form,
                            contextRef.current,
                        ),
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
                    (source.params && !areRelationDependenciesReady(params)) ||
                    !hasRequiredRelationParams(params, source)
                ) {
                    updates[key] = []
                    continue
                }

                const compareValue = {
                    ...normalizeRelationParams(params),
                    __module: source.module,
                    __method: source.method,
                }
                const previousParams = lastParamsRef.current[instanceKey][key]
                const cacheKey = buildRelationCacheKey(
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
                    !shallowEqualRelationParams(previousParams, compareValue)

                if (!isForce && !paramsChanged) {
                    continue
                }

                lastParamsRef.current[instanceKey][key] = compareValue

                if (isForce || (shouldForce && paramsChanged)) {
                    forceInvalidate(cacheKey)
                }

                try {
                    updates[key] = mergeRelationOptions(
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

    return relationState
}
