import axios from 'axios';
import contract from '../contracts/marketplace-contract.json';
import { getAccessToken, setAuth, clearAuth } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Client-App': 'axiro-base-admin',
    'X-Marketplace-Contract-Version': contract.contract_version,
  },
});

let refreshing = null;

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;
    const isAuthRequest = String(original?.url).includes('/login') || String(original?.url).includes('/refresh');

    if (error.response?.status === 401 && !original?._retry && !isAuthRequest) {
      original._retry = true;
      try {
        refreshing ??= axios
          .post(`${api.defaults.baseURL}/refresh`, {}, { withCredentials: true })
          .then((response) => response.data.data.access_token)
          .finally(() => { refreshing = null; });
        const token = await refreshing;
        setAuth({ access_token: token });
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (refreshError) {
        clearAuth();
        window.location.replace('/login');
        throw refreshError;
      }
    }

    const payload = error.response?.data || {};
    throw {
      status: error.response?.status,
      message: payload.status?.message || payload.message || 'Có lỗi xảy ra',
      errors: payload.errors || null,
      errorCode: payload.error_code || null,
      requestId: payload.meta?.request_id || error.response?.headers?.['x-request-id'] || null,
      correlationId: payload.meta?.correlation_id || error.response?.headers?.['x-correlation-id'] || null,
    };
  },
);

export default api;
