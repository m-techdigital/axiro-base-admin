import { useMemo } from 'react'

import { MODULE_REGISTRY } from '@/modules/registry'

export const getModuleConfig = (module, resource = null) => {
    const config = MODULE_REGISTRY[module] || {}

    if (!resource) return config

    return config?.[resource] || {}
}

export const getModuleService = (module, resource = null) =>
    getModuleConfig(module, resource)?.service

export const getModuleAction = (module, method, resource = null) => {
    const service = getModuleService(module, resource)

    if (!service || !method) return undefined

    const action = String(method)
        .split('.')
        .reduce((target, key) => target?.[key], service)

    return typeof action === 'function' ? action : undefined
}

export const useModule = (module, resource = null) =>
    useMemo(() => {
        const config = getModuleConfig(module, resource)

        return {
            ...config,
            config,
            service: config.service,
            fields: config.fields || null,
            tabs: config.tabs || null,
            columns: config.columns || [],
            filters: config.filters || [],
            statistics: config.statistics || [],
            actions: config.actions || {},
        }
    }, [module, resource])
