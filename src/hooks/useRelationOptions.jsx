import { useEffect, useRef, useState } from 'react'

const defaultLabel = (item) => item.name || item.code

export function useRelationOptions(service, label = defaultLabel) {
    const labelRef = useRef(label)
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        labelRef.current = label
    }, [label])

    useEffect(() => {
        let active = true

        setLoading(true)
        service
            .list({ per_page: 100 })
            .then((response) => {
                if (!active) return

                setOptions(
                    (response.data || []).map((item) => ({
                        value: item.id,
                        label: labelRef.current(item),
                        record: item,
                    })),
                )
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [service])

    return { options, loading }
}
