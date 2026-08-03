import api from '../../services/axios'

export default {
    overview: () => api.get('/operations-dashboard/overview'),
    today: () => api.get('/operations-dashboard/today'),
    timeline: (subjectType, subjectId) =>
        api.get(`/operations-dashboard/timeline/${subjectType}/${subjectId}`),
    holds: (params = {}) => api.get('/operations-dashboard/holds', { params }),
    releaseHold: (id, payload) =>
        api.post(`/operations-dashboard/holds/${id}/release`, payload),
    queues: (params = {}) =>
        api.get('/operations-dashboard/queues', { params }),
    idempotency: (params = {}) =>
        api.get('/operations-dashboard/idempotency', { params }),
    reconciliation: () => api.get('/operations-dashboard/reconciliation'),
    rentalSettlements: (params = {}) =>
        api.get('/operations-dashboard/rental-settlements', { params }),
    exportRentalSettlements: async (params = {}) => {
        const blob = await api.get(
            '/operations-dashboard/rental-settlements/export',
            { params, responseType: 'blob' },
        )
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `rental-settlements-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
    },
    requestRentalSettlementExport: (params = {}) =>
        api.post('/operations-dashboard/rental-settlements/exports', params),
    rentalSettlementExportStatus: (id) =>
        api.get(`/operations-dashboard/rental-settlements/exports/${id}`),
    downloadRentalSettlementExport: async (id) => {
        const blob = await api.get(
            `/operations-dashboard/rental-settlements/exports/${id}/download`,
            { responseType: 'blob' },
        )
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `rental-settlements-${id}.csv`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
    },
    availabilityTimeline: (productId) =>
        api.get(
            `/operations-dashboard/products/${productId}/availability-timeline`,
        ),
    documentChecklist: (transactionId) =>
        api.get(
            `/operations-dashboard/transactions/${transactionId}/document-checklist`,
        ),
}
