import { useLocation } from 'react-router-dom'
import { matchRouteMeta } from '@/routes/match'

export function useBreadcrumb({ title } = {}) {
    const { pathname } = useLocation()

    const segments = pathname.split('/').filter(Boolean)

    let path = ''
    const items = []

    segments.forEach((seg, index) => {
        path += `/${seg}`
        const isLast = index === segments.length - 1

        const matched = matchRouteMeta(path)

        if (!matched) return

        const [, meta] = matched

        items.push({
            title: isLast && title ? title : meta.title,
            path,
        })
    })

    return items
}
