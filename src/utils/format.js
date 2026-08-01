export const formatNumber = (input, locale = 'vi-VN', options = {}) => {
    const {
        unit = '',
        unitPosition = 'suffix', // 'prefix' | 'suffix'
        minimumFractionDigits,
        maximumFractionDigits,
    } = options

    const value = typeof input === 'object' ? input?.value : input

    if (value === null || value === undefined || value === '') {
        return ''
    }

    const num = Number(value)

    if (isNaN(num)) {
        return ''
    }

    const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(num)

    if (!unit) {
        return formatted
    }

    if (unitPosition === 'prefix') {
        return `${unit} ${formatted}`
    }

    return `${formatted} ${unit}`
}

export const formatCurrency = (input, options = {}) => {
    const {
        locale = 'vi-VN',
        currency = 'VND',
        compact = false,
        symbol = '₫',
        empty = '',
        maximumFractionDigits = 0,
    } = options

    const value = typeof input === 'object' ? input?.value : input

    if (value === null || value === undefined || value === '') {
        return empty
    }

    const number = Number(value)

    if (Number.isNaN(number)) {
        return empty
    }

    if (compact) {
        const abs = Math.abs(number)

        if (abs >= 1_000_000_000) {
            return `${formatNumber(number / 1_000_000_000, locale, {
                maximumFractionDigits: 2,
            })} tỷ`
        }

        if (abs >= 1_000_000) {
            return `${formatNumber(number / 1_000_000, locale, {
                maximumFractionDigits: 2,
            })} triệu`
        }
    }

    if (currency) {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            maximumFractionDigits,
        }).format(number)
    }

    return `${formatNumber(number, locale, { maximumFractionDigits })} ${symbol}`
}

export const formatCompactCurrency = (input, options = {}) =>
    formatCurrency(input, {
        compact: true,
        currency: null,
        ...options,
    })

export const formatPercent = (input, options = {}) => {
    const { locale = 'vi-VN', maximumFractionDigits = 2, empty = '' } = options

    if (input === null || input === undefined || input === '') {
        return empty
    }

    const number = Number(input)

    if (Number.isNaN(number)) {
        return empty
    }

    return `${formatNumber(number, locale, { maximumFractionDigits })}%`
}

export const formatReportValue = (value, format, options = {}) => {
    if (format === 'currency' || format === 'money') {
        return formatCompactCurrency(value, options)
    }

    if (format === 'percent') {
        return formatPercent(value, options)
    }

    return formatNumber(value, options.locale || 'vi-VN', options)
}
