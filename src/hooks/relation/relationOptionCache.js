const cache = {}
const inflight = {}
const resolved = {}
const sharedCache = {}
const sharedInflight = {}
const requestVersions = {}
const forceRefreshKeys = new Set()

export const relationOptionCache = {
    cache,
    inflight,
    resolved,
    sharedCache,
    sharedInflight,
    requestVersions,
    forceRefreshKeys,
    invalidate(cacheKey) {
        forceRefreshKeys.add(cacheKey)
        delete cache[cacheKey]
        delete resolved[cacheKey]
        delete inflight[cacheKey]
        delete requestVersions[cacheKey]
    },
}
