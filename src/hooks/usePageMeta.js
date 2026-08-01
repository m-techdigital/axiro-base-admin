import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { matchRouteMeta } from '@/routes/match'

export function usePageMeta({ title: overrideTitle, breadcrumbTitle } = {}) {
    const { pathname } = useLocation()

    const matched = useMemo(() => matchRouteMeta(pathname), [pathname])
    const meta = matched?.[1]

    // ===== TITLE =====
    const finalTitle = useMemo(() => {
        if (overrideTitle) return overrideTitle
        return meta?.title || ''
    }, [overrideTitle, meta])

    useEffect(() => {
        if (finalTitle) {
            document.title = finalTitle
        }
    }, [finalTitle])

    // ===== BREADCRUMB =====
    const breadcrumb = useMemo(() => {
        const segments = pathname.split('/').filter(Boolean)

        let path = []
        const items = []

        segments.forEach((seg) => {
            path.push(seg)
            const currentPath = '/' + path.join('/')

            const matchedRoute = matchRouteMeta(currentPath)

            if (!matchedRoute) return

            const [, m] = matchedRoute

            items.push({
                title: m.title,
                path: currentPath,
            })
        })

        // override last breadcrumb nếu có
        if (breadcrumbTitle && items.length > 0) {
            items[items.length - 1] = {
                ...items[items.length - 1],
                title: breadcrumbTitle,
            }
        }

        return items
    }, [pathname, breadcrumbTitle])

    return {
        title: finalTitle,
        breadcrumb,
    }
}
