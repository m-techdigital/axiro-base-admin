import {
    MARKETPLACE_DISPUTE_OUTCOMES,
    MARKETPLACE_DOCUMENT_TYPES,
    MARKETPLACE_OPTIONS_CACHE_TTL_SECONDS,
    MARKETPLACE_OPTIONS_CONTRACT_VERSION,
    MARKETPLACE_TRANSACTION_STATUSES,
    MARKETPLACE_GAME_ACCOUNT_DELIVERY_METHODS,
    MARKETPLACE_ITEM_DELIVERY_METHODS,
} from '@/generated/marketplaceOptions'

import api from './axios'

let cached = null
let expiresAt = 0
let loading = null

const fallbackOptions = {
    document_types: MARKETPLACE_DOCUMENT_TYPES,
    dispute_outcomes: MARKETPLACE_DISPUTE_OUTCOMES,
    transaction_statuses: MARKETPLACE_TRANSACTION_STATUSES,
    game_account_delivery_methods: MARKETPLACE_GAME_ACCOUNT_DELIVERY_METHODS,
    item_delivery_methods: MARKETPLACE_ITEM_DELIVERY_METHODS,
}
const fallbackTtlMs = MARKETPLACE_OPTIONS_CACHE_TTL_SECONDS * 1000
let cachedContractVersion = MARKETPLACE_OPTIONS_CONTRACT_VERSION

export const loadMarketplaceOptions = async ({ force = false } = {}) => {
    if (
        !force &&
        cached &&
        Date.now() < expiresAt &&
        cachedContractVersion === MARKETPLACE_OPTIONS_CONTRACT_VERSION
    ) {
        return cached
    }

    loading ??= api
        .get('/marketplace/options')
        .then((response) => {
            const payload = response?.data || response || {}
            const ttl = Number(
                response?.meta?.cache_ttl_seconds ||
                    MARKETPLACE_OPTIONS_CACHE_TTL_SECONDS,
            )
            cached = {
                document_types: payload.document_types?.length
                    ? payload.document_types
                    : fallbackOptions.document_types,
                dispute_outcomes: payload.dispute_outcomes?.length
                    ? payload.dispute_outcomes
                    : fallbackOptions.dispute_outcomes,
                transaction_statuses: payload.transaction_statuses?.length
                    ? payload.transaction_statuses
                    : fallbackOptions.transaction_statuses,
                game_account_delivery_methods: payload.game_account_delivery_methods?.length
                    ? payload.game_account_delivery_methods
                    : fallbackOptions.game_account_delivery_methods,
                item_delivery_methods: payload.item_delivery_methods?.length
                    ? payload.item_delivery_methods
                    : fallbackOptions.item_delivery_methods,
            }
            cachedContractVersion =
                response?.meta?.contract_version ||
                MARKETPLACE_OPTIONS_CONTRACT_VERSION
            const mismatch =
                cachedContractVersion !== MARKETPLACE_OPTIONS_CONTRACT_VERSION
            expiresAt = Date.now() + (mismatch ? Math.min(ttl, 30) : ttl) * 1000
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
