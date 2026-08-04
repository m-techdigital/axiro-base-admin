import { useLocation } from 'react-router'
import { ROUTE_META } from '../routes/meta'

export function useRouteMeta() {
    const { pathname } = useLocation()
    if (ROUTE_META[pathname]) return ROUTE_META[pathname]
    const matched = Object.entries(ROUTE_META)
        .filter(([path]) => path !== '/' && pathname.startsWith(path))
        .sort(([a], [b]) => b.length - a.length)[0]
    return matched?.[1] || { title: 'AXIRO MBN' }
}
