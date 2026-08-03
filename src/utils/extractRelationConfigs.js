export const extractRelationConfigs = (items = [], keyField = 'name') => {
    const result = []

    const normalizeKey = (key) => (Array.isArray(key) ? key.join('.') : key)

    const walk = (fields = [], prefix = '') => {
        ;(fields || []).forEach((item) => {
            // relation-like field
            if (
                ['relation', 'select_badge'].includes(item.type) &&
                item.source
            ) {
                const fieldKey = normalizeKey(item[keyField] || item.key)
                result.push({
                    key: prefix ? `${prefix}.${fieldKey}` : fieldKey,
                    source: item.source,
                    watch: item.watch || [],
                })
            }

            // dynamic list → recurse
            if (item.type === 'dynamic-form-list') {
                walk(item.props?.fields || [], item.name)
            }
        })
    }

    walk(items)

    return result
}
