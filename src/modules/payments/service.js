import api from '../../services/axios'
import { createPaginatedService } from '../../services/paginated.service'
const service = createPaginatedService('payments')
export default {
    ...service,
    confirm: (id) => api.post(`/payments/${id}/confirm`),
    reject: (id, note) => api.post(`/payments/${id}/reject`, { note }),
}
