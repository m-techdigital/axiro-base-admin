import { useEffect, useState } from 'react'
export function useRelationOptions(service, label = (x) => x.name || x.code) {
    const [options, setOptions] = useState([]),
        [loading, setLoading] = useState(true)
    useEffect(() => {
        service
            .list({ per_page: 100 })
            .then((r) =>
                setOptions(
                    (r.data || []).map((x) => ({
                        value: x.id,
                        label: label(x),
                        record: x,
                    })),
                ),
            )
            .finally(() => setLoading(false))
    }, [service])
    return { options, loading }
}
