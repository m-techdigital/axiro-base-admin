export const resolveActionProp = (value, record, context = {}) =>
    typeof value === 'function' ? value(record, context) : value
