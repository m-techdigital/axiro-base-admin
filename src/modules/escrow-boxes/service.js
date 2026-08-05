import api from '@/services/axios'
import { createCrudService } from '@/services/base.service'

const base = createCrudService('escrow-boxes')
export default {
    ...base,
    review: (id, data) => api.post(`/escrow-boxes/${id}/review`, data),
    reviewHandover: (id, stepId, data) =>
        api.post(`/escrow-boxes/${id}/handover-steps/${stepId}/review`, data),
    feeRules: () => api.get('/escrow-fee-rules'),
    createFeeRule: (data) => api.post('/escrow-fee-rules', data),
    updateFeeRule: (id, data) => api.put(`/escrow-fee-rules/${id}`, data),
}
