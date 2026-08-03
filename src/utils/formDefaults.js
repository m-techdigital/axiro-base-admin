const normalizePath = (path) => (Array.isArray(path) ? path : [path])

const getByPath = (source, path) =>
    normalizePath(path).reduce(
        (value, key) => (value == null ? undefined : value[key]),
        source,
    )

const setByPath = (target, path, value) => {
    const keys = normalizePath(path)
    const lastKey = keys[keys.length - 1]
    let cursor = target

    keys.slice(0, -1).forEach((key) => {
        if (
            !cursor[key] ||
            typeof cursor[key] !== 'object' ||
            Array.isArray(cursor[key])
        ) {
            cursor[key] = {}
        }

        cursor = cursor[key]
    })

    cursor[lastKey] = value

    return target
}

/**
 * =======================================================================
 * KHỞI TẠO GIÁ TRỊ MẶC ĐỊNH CHO FORM
 * =======================================================================
 */
export const buildDefaultValues = (fields = []) => {
    const defaults = {}

    fields.forEach((field) => {
        if (!field.name) return

        if (
            field.type === 'dynamic-form-list' ||
            field.type === 'dynamic-list'
        ) {
            setByPath(defaults, field.name, [])
            return
        }

        if (field.defaultValue !== undefined) {
            setByPath(defaults, field.name, field.defaultValue)
            return
        }

        if (
            field.type === 'switch' ||
            field.type === 'checkbox' ||
            field.type === 'card-switch'
        ) {
            setByPath(defaults, field.name, false)
            return
        }

        setByPath(defaults, field.name, undefined)
    })

    return defaults
}

/**
 * =======================================================================
 * ÉP KIỂU DỮ LIỆU THEO FIELD CONFIG
 * =======================================================================
 */
const normalizeValueByField = (value, field) => {
    if (value === undefined || value === null) {
        return value
    }

    switch (field.type) {
        case 'number':
        case 'number_formatter':
            return value === '' ? null : Number(value)

        default:
            return value
    }
}

/**
 * =======================================================================
 * CHUẨN HÓA RECORD CHO FORM
 * - Không động vào array primitive
 * - Chỉ xử lý dynamic-form-list
 * - Dựa vào field config thay vì hard-code field name
 * =======================================================================
 */
export const mergeFormValues = ({
    defaults = {},
    record = null,
    fields = [],
}) => {
    if (!record) {
        return { ...defaults }
    }

    const result = {
        ...defaults,
        ...record,
    }

    fields.forEach((field) => {
        const key = field.name

        if (!key) return

        const aliases = Array.isArray(field.aliases) ? field.aliases : []

        if (aliases.length) {
            const alias = aliases.find(
                (aliasKey) =>
                    record?.[aliasKey] !== undefined &&
                    record?.[aliasKey] !== null,
            )

            if (
                alias &&
                (field.preferAlias ||
                    getByPath(result, key) === undefined ||
                    getByPath(result, key) === null)
            ) {
                setByPath(result, key, getByPath(record, alias))
            }
        }

        const value = getByPath(result, key)

        /**
         * =====================================================
         * DYNAMIC FORM LIST
         * =====================================================
         */
        if (field.type === 'dynamic-form-list' && Array.isArray(value)) {
            const subFields = field.props?.fields || []

            setByPath(
                result,
                key,
                value.map((row) => {
                    if (!row || typeof row !== 'object' || Array.isArray(row)) {
                        return row
                    }

                    const nextRow = {
                        ...row,
                    }

                    subFields.forEach((subField) => {
                        const subKey = subField.name

                        if (!subKey) return

                        setByPath(
                            nextRow,
                            subKey,
                            normalizeValueByField(
                                getByPath(nextRow, subKey),
                                subField,
                            ),
                        )
                    })

                    return nextRow
                }),
            )

            return
        }

        /**
         * =====================================================
         * FIELD THƯỜNG
         * =====================================================
         */
        setByPath(result, key, normalizeValueByField(value, field))
    })

    return result
}
