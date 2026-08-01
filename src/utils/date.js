import dayjs from 'dayjs'

export const DATE_FORMAT = 'DD-MM-YYYY'

export const DATETIME_FORMAT = 'DD-MM-YYYY HH:mm:ss'

export const API_DATE_FORMAT = 'YYYY-MM-DD'

export const API_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const parseDate = (value) => {
    if (!value) {
        return null
    }

    return dayjs(value)
}

export const formatDate = (value, format = DATE_FORMAT) => {
    if (!value) {
        return '—'
    }

    return dayjs(value).format(format)
}

export const toApiDate = (value) => {
    if (!value) {
        return null
    }

    return dayjs(value).format(API_DATE_FORMAT)
}

export const toApiDateTime = (value) => {
    if (!value) {
        return null
    }

    return dayjs(value).format(API_DATETIME_FORMAT)
}
