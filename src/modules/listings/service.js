import api from '../../services/axios'
import { createPaginatedService } from '../../services/paginated.service'
const service = createPaginatedService('listings')
export default {
    ...service,
    approve: (id) => api.post(`/listings/${id}/approve`),
    reject: (id, reason) => api.post(`/listings/${id}/reject`, { reason }),
}
