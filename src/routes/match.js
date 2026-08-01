import { ROUTE_META } from './meta'

const routeToRegex = (route) => {
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = escaped.replace(/:([^/]+)/g, '[^/]+')
    return new RegExp(`^${pattern}$`)
}

const routeScore = (route) => {
    const segments = route.split('/').filter(Boolean)
    const dynamicCount = segments.filter((segment) =>
        segment.startsWith(':'),
    ).length
    const staticCount = segments.length - dynamicCount

    return staticCount * 1000 + segments.length * 10 - dynamicCount
}

const sortedRouteMetaEntries = () =>
    Object.entries(ROUTE_META).sort(([routeA], [routeB]) => {
        const scoreDiff = routeScore(routeB) - routeScore(routeA)
        if (scoreDiff !== 0) return scoreDiff
        return routeB.length - routeA.length
    })

export const matchRouteMeta = (pathname) =>
    sortedRouteMetaEntries().find(([route]) =>
        routeToRegex(route).test(pathname),
    )
