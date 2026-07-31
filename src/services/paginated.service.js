import api from './axios';
const normalize = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload)) return response;
  return {
    data: payload?.data || [],
    meta: { pagination: {
      current_page: payload?.current_page || 1,
      last_page: payload?.last_page || 1,
      per_page: payload?.per_page || 20,
      total: payload?.total || 0,
    } },
  };
};
export const createPaginatedService = (resource) => ({
  list: (params = {}) => api.get(`/${resource}`, { params }).then(normalize),
  get: (id) => api.get(`/${resource}/${id}`),
  create: (data) => api.post(`/${resource}`, data),
  update: (id, data) => api.put(`/${resource}/${id}`, data),
  delete: (id) => api.delete(`/${resource}/${id}`),
});
