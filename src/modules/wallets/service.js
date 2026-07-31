import api from '../../services/axios';
export default {
  list: (params = {}) => api.get('/wallets', { params }),
  detail: (customerId, params = {}) => api.get(`/wallets/${customerId}`, { params }),
  adjust: (customerId, payload) => api.post(`/wallets/${customerId}/adjust`, payload),
};
