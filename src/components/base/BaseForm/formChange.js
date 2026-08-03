export const clearChangedErrors = ({ changedKeys, setServerErrors, form }) => {
    if (!changedKeys.length) return

    setServerErrors((current) => {
        const next = { ...current }
        let dirty = false

        if (Object.prototype.hasOwnProperty.call(next, '_form')) {
            delete next._form
            dirty = true
        }

        Object.keys(next).forEach((field) => {
            if (changedKeys.includes(String(field).split('.')[0])) {
                delete next[field]
                dirty = true
            }
        })

        return dirty ? next : current
    })

    form.setFields(changedKeys.map((name) => ({ name, errors: [] })))
}

export const runFieldChangeHandlers = ({
    changed,
    allValues,
    fields,
    form,
    record,
    syncingFieldRef,
}) => {
    Object.entries(changed).forEach(([key, value]) => {
        if (syncingFieldRef.current === key) {
            syncingFieldRef.current = null
            return
        }

        const field = fields.find((item) => item.name === key)

        if (typeof field?.onChange !== 'function') return

        field.onChange(value, {
            values: allValues,
            changed,
            form,
            record,

            setFieldValue(name, nextValue) {
                syncingFieldRef.current = name
                form.setFieldValue(name, nextValue)
            },

            setFieldsValue(nextValues) {
                const keys = Object.keys(nextValues)

                if (keys.length === 1) {
                    syncingFieldRef.current = keys[0]
                }

                form.setFieldsValue(nextValues)
            },
        })
    })
}

export const buildDependentResetFields = ({
    changedKeys,
    relationConfigs,
    fields,
}) => {
    const resetFields = {}

    changedKeys.forEach((changedKey) => {
        relationConfigs.forEach((cfg) => {
            if (cfg.watch?.includes(changedKey)) {
                resetFields[cfg.key] = undefined
            }
        })

        fields.forEach((field) => {
            const dependsOn = field.dependsOn?.field || field.dependsOn

            if (dependsOn === changedKey) {
                resetFields[field.name] =
                    field.type === 'multiple-select' ? [] : null
            }
        })
    })

    return resetFields
}
