import api from '../../services/axios';
export default {
  show: () => api.get('/payment-settings').then((response) => response.data?.data ?? response.data),
  update: (payload) => api.put('/payment-settings', payload).then((response) => response.data?.data ?? response.data),
  preview: (payload) => api.post('/payment-settings/qr-preview', payload).then((response) => response.data?.data ?? response.data),
};
