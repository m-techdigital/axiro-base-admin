import { getListData, getPaginationMeta } from '@/utils'

import api from './axios'

const normalize = (response) => ({
    data: getListData(response),
    meta: getPaginationMeta(response),
})

export const createPaginatedService = (resource) => ({
    list: (params = {}, config = {}) =>
        api.get(`/${resource}`, { ...config, params }).then(normalize),
    get: (id, config = {}) => api.get(`/${resource}/${id}`, config),
    create: (data, config = {}) => api.post(`/${resource}`, data, config),
    update: (id, data, config = {}) =>
        api.put(`/${resource}/${id}`, data, config),
    delete: (id, config = {}) => api.delete(`/${resource}/${id}`, config),
})
