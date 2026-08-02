import api from '../../services/axios'
import { createPaginatedService } from '../../services/paginated.service'

const service = createPaginatedService('notifications')

export default {
    ...service,
    read: (id) => api.post(`/notifications/${id}/read`),
    readAll: () => api.post('/notifications/read-all'),
}
