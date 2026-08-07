import dayjs from 'dayjs'
import 'dayjs/locale/vi'

dayjs.locale('vi')

const isMoneyField = (field = '') =>
    /(^|_)(amount|fee|price|value|balance|topup)$/i.test(field)
const labels = {
    deal_type: 'Loại giao dịch',
    topup_amount: 'Tiền bù',
    topup_payer_side: 'Bên bù tiền',
    fee_payer_mode: 'Bên chịu phí',
    inspection_period_minutes: 'Thời gian kiểm tra',
    party_a_asset: 'Tài sản Bên A',
    party_b_asset: 'Tài sản Bên B',
    success_conditions: 'Điều kiện thành công',
    cancellation_conditions: 'Điều kiện hủy',
    additional_terms: 'Điều khoản bổ sung',
    agreement_version: 'Phiên bản điều khoản',
    note: 'Ghi chú',
    reason: 'Lý do',
}

const flatten = (value, prefix = '') => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return prefix ? { [prefix]: value } : {}
    }

    return Object.entries(value).reduce((acc, [key, item]) => {
        const path = prefix ? `${prefix}.${key}` : key
        if (
            item &&
            typeof item === 'object' &&
            !Array.isArray(item) &&
            !('label' in item) &&
            !('name' in item) &&
            !('title' in item)
        ) {
            Object.assign(acc, flatten(item, path))
        } else {
            acc[path] = item
        }
        return acc
    }, {})
}

const diff = (oldValue, newValue) => {
    const oldFlat = flatten(oldValue || {})
    const newFlat = flatten(newValue || {})
    return [...new Set([...Object.keys(oldFlat), ...Object.keys(newFlat)])]
        .filter(
            (field) =>
                JSON.stringify(oldFlat[field]) !==
                JSON.stringify(newFlat[field]),
        )
        .map((field) => ({ field, old: oldFlat[field], new: newFlat[field] }))
}

const fieldLabel = (field, schema) => {
    const last = field.split('.').pop()
    return (
        schema?.fields?.[field]?.label ||
        schema?.fields?.[last]?.label ||
        labels[last] ||
        last.replace(/_/g, ' ')
    )
}

const format = (value, field, schema) => {
    if (value === null || value === undefined || value === '') return '—'
    const last = field.split('.').pop()
    const config = schema?.fields?.[field] || schema?.fields?.[last]
    if (config?.options) {
        const option = config.options.find((item) => item.value === value)
        if (option) return option.label
    }
    if (config?.type === 'money' || isMoneyField(last)) {
        const number = Number(value)
        return Number.isNaN(number)
            ? value
            : `${number.toLocaleString('vi-VN')} đ`
    }
    if (typeof value === 'object')
        return (
            value.label ||
            value.name ||
            value.title ||
            value.code ||
            JSON.stringify(value)
        )
    return String(value)
}

export const buildTimelineGroups = (data = [], schema = null) => {
    const grouped = data.reduce((acc, item) => {
        const key = dayjs(item.created_at).format('YYYY-MM-DD')
        acc[key] ||= []
        acc[key].push(item)
        return acc
    }, {})

    return Object.entries(grouped).map(([date, items]) => ({
        date,
        label: dayjs(date).isSame(dayjs(), 'day')
            ? 'Hôm nay'
            : dayjs(date).format('dddd, DD/MM/YYYY'),
        items: items.map((item) => {
            const changes =
                item.activity_type === 'created'
                    ? Object.entries(flatten(item.new || {})).map(
                          ([field, value]) => ({
                              field,
                              old: null,
                              new: value,
                          }),
                      )
                    : diff(item.old, item.new)
            return {
                id: item.id,
                timelineKey: item.timeline_key,
                title: item.title,
                actor: item.changed_by,
                time: dayjs(item.created_at).format('HH:mm'),
                activityType: item.activity_type,
                activitySubtype: item.activity_subtype,
                content: item.notes,
                changes: changes.map((change) => ({
                    ...change,
                    label: fieldLabel(change.field, schema),
                    old: format(change.old, change.field, schema),
                    new: format(change.new, change.field, schema),
                })),
            }
        }),
    }))
}
