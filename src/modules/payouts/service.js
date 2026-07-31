import api from '../../services/axios'
export default {
    verifications: (params = {}) =>
        api.get('/seller-verifications', { params }),
    reviewVerification: (id, decision, note) =>
        api.post(`/seller-verifications/${id}/review`, { decision, note }),
    accounts: (params = {}) => api.get('/payout-accounts', { params }),
    reviewAccount: (id, decision, note) =>
        api.post(`/payout-accounts/${id}/review`, { decision, note }),
    withdrawals: (params = {}) => api.get('/withdrawals', { params }),
    approve: (id) => api.post(`/withdrawals/${id}/approve`),
    reject: (id, note) => api.post(`/withdrawals/${id}/reject`, { note }),
    paid: (id, payment_reference, proof_url) =>
        api.post(`/withdrawals/${id}/paid`, { payment_reference, proof_url }),
}
