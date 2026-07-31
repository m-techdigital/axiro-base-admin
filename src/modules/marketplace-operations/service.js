import api from '../../services/axios'
export default {
    feePolicies: (params = {}) => api.get('/fee-policies', { params }),
    createFeePolicy: (payload) => api.post('/fee-policies', payload),
    updateFeePolicy: (id, payload) => api.put(`/fee-policies/${id}`, payload),
    cases: (params = {}) => api.get('/marketplace-cases', { params }),
    caseDetail: (id) => api.get(`/marketplace-cases/${id}`),
    updateCase: (id, payload) =>
        api.post(`/marketplace-cases/${id}/update`, payload),
    message: (id, payload) =>
        api.post(`/marketplace-cases/${id}/messages`, payload),
    snapshots: (params = {}) => api.get('/asset-snapshots', { params }),
}
