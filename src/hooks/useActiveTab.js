import { useSearchParams } from 'react-router'

export default function useActiveTab(
    defaultTab = 'overview',
    paramName = 'tab',
) {
    const [searchParams, setSearchParams] = useSearchParams()

    const activeTab = searchParams.get(paramName) || defaultTab

    const setActiveTab = (tab) => {
        const next = new URLSearchParams(searchParams)

        next.set(paramName, tab)

        setSearchParams(next)
    }

    return {
        activeTab,
        setActiveTab,
    }
}
