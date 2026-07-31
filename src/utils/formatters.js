const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
})

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
})

export const formatCurrency = (value) =>
    currencyFormatter.format(Number(value || 0))

export const formatDateTime = (value, fallback = '—') => {
    if (!value) {
        return fallback
    }

    const date = value instanceof Date ? value : new Date(value)

    return Number.isNaN(date.getTime())
        ? fallback
        : dateTimeFormatter.format(date)
}
