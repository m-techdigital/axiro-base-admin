const K = 'access_token'
export const getAccessToken = () => localStorage.getItem(K)
export const setAuth = ({ access_token }) =>
    access_token && localStorage.setItem(K, access_token)
export const clearAuth = () => localStorage.removeItem(K)
