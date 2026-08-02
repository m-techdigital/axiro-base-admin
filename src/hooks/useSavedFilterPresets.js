import { useCallback, useMemo, useState } from 'react'

const read = (key) => {
    try {
        return JSON.parse(window.localStorage.getItem(key) || '[]')
    } catch {
        return []
    }
}

export default function useSavedFilterPresets(storageKey) {
    const [presets, setPresets] = useState(() => read(storageKey))

    const persist = useCallback(
        (next) => {
            setPresets(next)
            window.localStorage.setItem(storageKey, JSON.stringify(next))
        },
        [storageKey],
    )

    const save = useCallback(
        (name, values) => {
            const normalized = name.trim()
            if (!normalized) return
            const next = [
                ...presets.filter((item) => item.name !== normalized),
                { name: normalized, values },
            ]
            persist(next)
        },
        [persist, presets],
    )

    const remove = useCallback(
        (name) => persist(presets.filter((item) => item.name !== name)),
        [persist, presets],
    )

    return useMemo(() => ({ presets, save, remove }), [presets, remove, save])
}
