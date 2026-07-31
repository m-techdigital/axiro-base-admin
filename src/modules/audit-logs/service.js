import api from '../../services/axios'
import { createPaginatedService } from '../../services/paginated.service'
const service = createPaginatedService('audit-logs')
export default {
    ...service,
    statistics: () => api.get('/audit-logs/statistics'),
}
