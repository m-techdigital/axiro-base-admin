export { API_PATHS } from './apiPaths'
export const resourceEndpoint = (resource, id) =>
    id == null ? `/${resource}` : `/${resource}/${id}`
