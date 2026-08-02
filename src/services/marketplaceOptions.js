import api from './axios'

let cached = null
let loading = null

const fallbackOptions = {
    document_types: [
        { value: 'sale_record', label: 'Hồ sơ mua bán tài khoản trò chơi' },
        { value: 'rental_record', label: 'Hồ sơ thuê tài khoản trò chơi' },
    ],
    dispute_outcomes: [
        { value: 'complete', label: 'Chấp nhận và hoàn tất giao dịch' },
        { value: 'cancel_refund', label: 'Chấp nhận, hủy và hoàn tiền' },
        { value: 'cancel_no_refund', label: 'Chấp nhận, hủy không hoàn tiền' },
        { value: 'reopen', label: 'Từ chối và đưa giao dịch về luồng xử lý' },
    ],
}

export const loadMarketplaceOptions = async () => {
    if (cached) return cached
    loading ??= api
        .get('/marketplace/options')
        .then((response) => {
            cached = response.data || {}
            return cached
        })
        .catch(() => fallbackOptions)
        .finally(() => {
            loading = null
        })
    return loading
}

export const optionMap = (items = []) =>
    Object.fromEntries(items.map(({ value, label }) => [value, label]))
