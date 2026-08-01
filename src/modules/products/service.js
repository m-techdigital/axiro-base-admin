import api from '../../services/axios'
import { createCrudService } from '../../services/base.service'
const service = createCrudService('products')
export default {
    ...service,
    approve: (id) => api.post(`/products/${id}/approve`),
    reject: (id, reason) => api.post(`/products/${id}/reject`, { reason }),
}
