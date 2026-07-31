import { compactParams } from '@/utils'

import api from './axios'

export const createCrudService = (resource) => ({
    list: (params = {}, config = {}) =>
        api.get(`/${resource}`, {
            ...config,
            params: compactParams(params),
        }),
    get: (id, config = {}) => api.get(`/${resource}/${id}`, config),
    create: (data, config = {}) => api.post(`/${resource}`, data, config),
    update: (id, data, config = {}) =>
        api.put(`/${resource}/${id}`, data, config),
    delete: (id, config = {}) => api.delete(`/${resource}/${id}`, config),
    options: (params = {}, config = {}) =>
        api.get(`/${resource}/options`, {
            ...config,
            params: compactParams(params),
        }),
})
