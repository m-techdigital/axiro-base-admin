import axios from 'axios'

import contract from '../contracts/marketplace-contract.json'
import { clearAuth, getAccessToken, setAuth } from '../utils/auth'
import { normalizeApiError } from '../utils/apiAdapter'

const api = axios.create({
    baseURL: import.meta.env.DEV
        ? '/api/v1'
        : import.meta.env.VITE_API_URL || '/api/v1',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'X-Client-App': 'axiro-base-admin',
        'X-Marketplace-Contract-Version': contract.contract_version,
    },
})

let refreshing = null

const createRequestId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `req-${Date.now()}-${Math.random().toString(16).slice(2)}`

api.interceptors.request.use((config) => {
    const token = getAccessToken()

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    config.headers['X-Request-ID'] ||= createRequestId()
    config.headers['X-Correlation-ID'] ||=
        globalThis.sessionStorage?.getItem('axiro.correlation_id') ||
        config.headers['X-Request-ID']

    return config
})

api.interceptors.response.use(
    (response) => {
        const correlationId = response.headers?.['x-correlation-id']

        if (correlationId) {
            globalThis.sessionStorage?.setItem(
                'axiro.correlation_id',
                correlationId,
            )
        }

        return response.data
    },
    async (error) => {
        const original = error.config
        const url = String(original?.url || '')
        const isAuthRequest = url.includes('/login') || url.includes('/refresh')

        if (
            error.response?.status === 401 &&
            !original?._retry &&
            !isAuthRequest
        ) {
            original._retry = true

            try {
                refreshing ??= axios
                    .post(
                        `${api.defaults.baseURL}/refresh`,
                        {},
                        { withCredentials: true },
                    )
                    .then((response) => response.data.data.access_token)
                    .finally(() => {
                        refreshing = null
                    })

                const token = await refreshing
                setAuth({ access_token: token })
                original.headers.Authorization = `Bearer ${token}`

                return api(original)
            } catch (refreshError) {
                clearAuth()
                window.location.replace('/login')
                throw normalizeApiError(refreshError)
            }
        }

        throw normalizeApiError(error)
    },
)

export default api
