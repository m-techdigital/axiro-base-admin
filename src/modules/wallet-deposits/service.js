import api from '../../services/axios'
import { createPaginatedService } from '../../services/paginated.service'
const service = createPaginatedService('wallet-deposits')
export default {
    ...service,
    confirm: (id) => api.post(`/wallet-deposits/${id}/confirm`),
    reject: (id, note) => api.post(`/wallet-deposits/${id}/reject`, { note }),
}
