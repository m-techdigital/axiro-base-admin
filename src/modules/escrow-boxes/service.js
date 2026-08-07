import api from '@/services/axios'
import { createCrudService } from '@/services/base.service'

const base = createCrudService('escrow-boxes')
export default {
    ...base,
    createByAdmin: (data) => api.post('/escrow-boxes', data),
    rotateInvites: (id) => api.post(`/escrow-boxes/${id}/invites/rotate`),
    getTimeline: (id, params = {}) =>
        api.get(`/escrow-boxes/${id}/timeline`, { params }),
    cancel: (id, data) => api.post(`/escrow-boxes/${id}/cancel`, data),
    review: (id, data) => api.post(`/escrow-boxes/${id}/review`, data),
    reviewHandover: (id, stepId, data) =>
        api.post(`/escrow-boxes/${id}/handover-steps/${stepId}/review`, data),
    feeRules: () => api.get('/escrow-fee-rules'),
    createFeeRule: (data) => api.post('/escrow-fee-rules', data),
    updateFeeRule: (id, data) => api.put(`/escrow-fee-rules/${id}`, data),
}
