import { useEffect, useState } from 'react'

export function useIsMobile(breakpoint = 992) {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.innerWidth < breakpoint,
    )
    useEffect(() => {
        const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
        const sync = () => setIsMobile(media.matches)
        sync()
        media.addEventListener('change', sync)
        return () => media.removeEventListener('change', sync)
    }, [breakpoint])
    return isMobile
}
