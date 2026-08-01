export const resolveFieldValue = (record, field) => {
    if (!record || !field) return undefined

    const paths = field.split('|') // fallback chain

    for (const path of paths) {
        const keys = path.split('.')

        let current = record

        for (const key of keys) {
            if (current == null) break
            current = current[key]
        }

        if (current != null) return current
    }

    return undefined
}
