import contract from '@/contracts/marketplace-contract.json'

import api from './axios'

let cached = null
let expiresAt = 0
let loading = null

const catalog = contract.option_catalog || {}
const fallbackOptions = {
    document_types: catalog.document_types || [],
    dispute_outcomes: catalog.dispute_outcomes || [],
}
const fallbackTtlMs = Number(catalog.cache_ttl_seconds || 300) * 1000

export const loadMarketplaceOptions = async ({ force = false } = {}) => {
    if (!force && cached && Date.now() < expiresAt) return cached

    loading ??= api
        .get('/marketplace/options')
        .then((response) => {
            const payload = response?.data || response || {}
            const ttl = Number(
                response?.meta?.cache_ttl_seconds ||
                    catalog.cache_ttl_seconds ||
                    300,
            )
            cached = {
                document_types: payload.document_types?.length
                    ? payload.document_types
                    : fallbackOptions.document_types,
                dispute_outcomes: payload.dispute_outcomes?.length
                    ? payload.dispute_outcomes
                    : fallbackOptions.dispute_outcomes,
            }
            expiresAt = Date.now() + ttl * 1000
            return cached
        })
        .catch(() => {
            cached = fallbackOptions
            expiresAt = Date.now() + fallbackTtlMs
            return cached
        })
        .finally(() => {
            loading = null
        })

    return loading
}

export const optionMap = (items = []) =>
    Object.fromEntries(items.map(({ value, label }) => [value, label]))
