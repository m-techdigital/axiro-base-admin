import api from '../../services/axios'

const unwrap = (response) => response.data?.data ?? response.data

export default {
    show: () => api.get('/payment-settings').then(unwrap),
    history: () => api.get('/payment-settings/history').then(unwrap),
    update: (payload) => api.put('/payment-settings', payload).then(unwrap),
    activate: (id) => api.post(`/payment-settings/${id}/activate`).then(unwrap),
    preview: (payload) =>
        api.post('/payment-settings/qr-preview', payload).then(unwrap),
}
