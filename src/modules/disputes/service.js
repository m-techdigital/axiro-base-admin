import api from '../../services/axios';
import {createPaginatedService} from '../../services/paginated.service';
const service=createPaginatedService('disputes');
export default {...service,resolve:(id,data)=>api.post(`/disputes/${id}/resolve`,data)};
