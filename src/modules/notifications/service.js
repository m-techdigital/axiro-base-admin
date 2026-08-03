import api from '../../services/axios'
import { createPaginatedService } from '../../services/paginated.service'

const service = createPaginatedService('notifications')

export default {
    ...service,
    show: (id) => api.get(`/notifications/${id}`),
    read: (id) => api.post(`/notifications/${id}/read`),
    readAll: () => api.post('/notifications/read-all'),
    handle: (id, note) => api.post(`/notifications/${id}/handle`, { note }),
}
