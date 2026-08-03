import api from '../../services/axios'
import { createCrudService } from '../../services/base.service'
const service = createCrudService('transactions')
export default {
    ...service,
    nextActions: (id) => api.get(`/transactions/${id}/next-actions`),
    action: (id, data) => api.post(`/transactions/${id}/actions`, data),
    confirmPayment: (paymentId) => api.post(`/payments/${paymentId}/confirm`),
    rejectPayment: (paymentId, data) =>
        api.post(`/payments/${paymentId}/reject`, data),
}
