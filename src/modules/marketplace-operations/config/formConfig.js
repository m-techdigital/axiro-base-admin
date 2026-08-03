import { CASE_PRIORITY_OPTIONS, CASE_STATUS_OPTIONS } from '@/constants/options'
import { CASE_STATUSES } from './options'

export const transactionTypeOptions = [
    { value: 'purchase', label: 'Mua bán' },
    { value: 'rental', label: 'Cho thuê' },
]

export const transactionEndOptions = [
    { value: 'completed', label: 'Hoàn tất và quyết toán' },
    { value: 'cancelled', label: 'Hủy và hoàn tiền' },
]

export const feePolicyFields = [
    { name: 'id', type: 'hidden' },
    { name: 'code', label: 'Mã', rules: [{ required: true }], span: 8 },
    { name: 'name', label: 'Tên', rules: [{ required: true }], span: 10 },
    {
        name: 'transaction_type',
        label: 'Loại giao dịch',
        type: 'select',
        options: transactionTypeOptions,
        span: 6,
    },
    {
        name: 'buyer_fee_rate',
        label: 'Phí người mua (%)',
        type: 'number',
        rules: [{ required: true }],
        props: { min: 0, max: 100 },
        span: 6,
    },
    {
        name: 'buyer_fixed_fee',
        label: 'Phí cố định người mua',
        type: 'number',
        props: { min: 0 },
        span: 6,
    },
    {
        name: 'seller_fee_rate',
        label: 'Phí người bán (%)',
        type: 'number',
        rules: [{ required: true }],
        props: { min: 0, max: 100 },
        span: 6,
    },
    {
        name: 'seller_fixed_fee',
        label: 'Phí cố định người bán',
        type: 'number',
        props: { min: 0 },
        span: 6,
    },
    {
        name: 'tax_rate',
        label: 'Thuế trên phí (%)',
        type: 'number',
        props: { min: 0, max: 100 },
        span: 6,
    },
    {
        name: 'priority',
        label: 'Ưu tiên',
        type: 'number',
        props: { min: 1 },
        span: 6,
    },
    {
        name: 'is_active',
        text: 'Đang áp dụng',
        type: 'checkbox',
        label: 'Trạng thái',
        span: 6,
    },
]

export const operationCaseFields = [
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: CASE_STATUS_OPTIONS.filter(({ value }) =>
            CASE_STATUSES.includes(value),
        ),
        rules: [{ required: true }],
        span: 12,
    },
    {
        name: 'priority',
        label: 'Ưu tiên',
        type: 'select',
        options: CASE_PRIORITY_OPTIONS,
        span: 12,
    },
    {
        name: 'resolution',
        label: 'Kết quả xử lý',
        type: 'textarea',
        rows: 5,
        span: 24,
    },
    {
        name: 'transaction_status',
        label: 'Kết thúc giao dịch',
        type: 'select',
        options: transactionEndOptions,
        span: 24,
    },
]
