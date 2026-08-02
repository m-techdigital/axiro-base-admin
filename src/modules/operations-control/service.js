import api from '../../services/axios'

export default {
    overview: () => api.get('/operations-dashboard/overview'),
    holds: (params = {}) => api.get('/operations-dashboard/holds', { params }),
    releaseHold: (id, payload) =>
        api.post(`/operations-dashboard/holds/${id}/release`, payload),
    queues: (params = {}) =>
        api.get('/operations-dashboard/queues', { params }),
    idempotency: (params = {}) =>
        api.get('/operations-dashboard/idempotency', { params }),
    reconciliation: () => api.get('/operations-dashboard/reconciliation'),
    availabilityTimeline: (productId) =>
        api.get(
            `/operations-dashboard/products/${productId}/availability-timeline`,
        ),
    documentChecklist: (transactionId) =>
        api.get(
            `/operations-dashboard/transactions/${transactionId}/document-checklist`,
        ),
}
