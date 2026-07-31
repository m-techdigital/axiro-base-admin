import api from '../../services/axios'
export default {
    list: (params = {}) => api.get('/generated-documents', { params }),
    get: (id) => api.get(`/generated-documents/${id}`),
    preview: (id) => api.get(`/generated-documents/${id}/preview`),
    ensure: (transactionId) =>
        api.post(`/transactions/${transactionId}/documents/ensure`),
    download: (id) =>
        api.get(`/generated-documents/${id}/download`, {
            responseType: 'blob',
        }),
}
