import api from '../../services/axios'
export default {
    reviews: (params = {}) => api.get('/marketplace-reviews', { params }),
    moderateReview: (id, payload) =>
        api.post(`/marketplace-reviews/${id}/moderate`, payload),
    contents: (params = {}) => api.get('/content-entries', { params }),
    createContent: (payload) => api.post('/content-entries', payload),
    updateContent: (id, payload) => api.put(`/content-entries/${id}`, payload),
    risks: (params = {}) => api.get('/risk-flags', { params }),
    resolveRisk: (id, payload) =>
        api.post(`/risk-flags/${id}/resolve`, payload),
}
