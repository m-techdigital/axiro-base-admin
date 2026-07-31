import api from '../../services/axios'
export default { get: () => api.get('/action-center') }
