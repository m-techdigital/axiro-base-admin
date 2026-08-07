export const flattenFields = (fields = []) => {
    const result = []

    const walk = (items = []) => {
        items.forEach((field) => {
            result.push(field)

            if (field.type === 'dynamic-form-list') {
                walk(field.props?.fields || [])
            }

            if (field.tabs) {
                field.tabs.forEach((tab) => walk(tab.fields || []))
            }
        })
    }

    walk(fields)

    return result
}

export const normalizeGroups = ({ fields, tabs, sections }) => {
    if (sections?.length) {
        return sections.map((section) => ({
            key: section.key,
            label: section.label,
            description: section.description,
            fields: section.fields || [],
        }))
    }

    if (tabs?.length) {
        return tabs.map((tab) => ({
            key: tab.key,
            label: tab.label,
            fields: tab.fields || [],
        }))
    }

    return [
        {
            key: '__default__',
            label: null,
            fields: fields || [],
        },
    ]
}

export const resolveHidden = (field, record, values, form) => {
    if (typeof field?.hidden === 'function') {
        return field.hidden(record, {
            values,
            record,
            form,
        })
    }

    return field?.hidden === true
}

export const toNamePath = (name) =>
    (Array.isArray(name) ? name : [name]).filter(
        (item) => item !== undefined && item !== null,
    )

export const hasValueAtPath = (source, name) => {
    const path = toNamePath(name)
    let current = source

    return path.every((part) => {
        if (
            current === null ||
            typeof current !== 'object' ||
            !Object.prototype.hasOwnProperty.call(current, part)
        ) {
            return false
        }

        current = current[part]

        return true
    })
}

export const getValueAtPath = (source, name) =>
    toNamePath(name).reduce(
        (current, part) =>
            current === null || current === undefined
                ? undefined
                : current[part],
        source,
    )

export const setValueAtPath = (target, name, value) => {
    const path = toNamePath(name)
    if (!path.length) return

    let current = target
    path.forEach((part, index) => {
        if (index === path.length - 1) {
            current[part] = value
            return
        }

        if (
            current[part] === null ||
            typeof current[part] !== 'object' ||
            Array.isArray(current[part])
        ) {
            current[part] = {}
        }

        current = current[part]
    })
}
