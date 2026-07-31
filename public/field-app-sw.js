const CACHE_NAME = 'field-app-shell-v2'
const APP_SHELL = ['/field-app', '/favicon.ico']

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .catch(() => undefined),
    )
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
            ))
            .then(() => self.clients.claim())
            .catch(() => undefined),
    )
})

self.addEventListener('fetch', (event) => {
    const request = event.request
    const requestUrl = new URL(request.url)

    // The Field App worker must never proxy API calls, map/geocoding tiles,
    // non-GET requests, browser extensions, or another origin.
    if (
        request.method !== 'GET' ||
        requestUrl.origin !== self.location.origin ||
        requestUrl.pathname.startsWith('/api/') ||
        !requestUrl.pathname.startsWith('/field-app') &&
            !requestUrl.pathname.startsWith('/assets/') &&
            requestUrl.pathname !== '/favicon.ico'
    ) {
        return
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone()
                    caches.open(CACHE_NAME).then((cache) => cache.put('/field-app', copy)).catch(() => {})
                    return response
                })
                .catch(async () => (await caches.match('/field-app')) || Response.error()),
        )
        return
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached
            return fetch(request).catch(() => Response.error())
        }),
    )
})
