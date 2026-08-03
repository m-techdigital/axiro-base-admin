import { TRANSACTION_STATUS_OPTIONS } from '@/constants/options'
import dayjs from 'dayjs'

export const transactionTypeOptions = [
    { value: 'purchase', label: 'Mua bán' },
    { value: 'rental', label: 'Thuê' },
]

export const transactionDefaultValues = {
    transaction_type: 'purchase',
    status: 'pending_payment',
    transaction_date: dayjs(),
    service_fee: 0,
    discount: 0,
    deposit_amount: 0,
    paid_amount: 0,
    refunded_amount: 0,
}

export const toTransactionFormRecord = (data = {}) => ({
    ...data,
    transaction_date: data.transaction_date
        ? dayjs(data.transaction_date)
        : null,
    due_date: data.due_date ? dayjs(data.due_date) : null,
    rental_start_at: data.rental_start_at ? dayjs(data.rental_start_at) : null,
    rental_end_at: data.rental_end_at ? dayjs(data.rental_end_at) : null,
})

export const createTransactionFormFields = ({
    customerOptions = [],
    productOptions = [],
} = {}) => [
    { name: 'code', label: 'Mã', rules: [{ required: true }], span: 4 },
    {
        name: 'transaction_type',
        label: 'Loại giao dịch',
        type: 'select',
        options: transactionTypeOptions,
        rules: [{ required: true }],
        span: 4,
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: TRANSACTION_STATUS_OPTIONS,
        span: 4,
    },
    {
        name: 'product_id',
        label: 'Sản phẩm',
        type: 'select',
        options: productOptions,
        rules: [{ required: true }],
        props: { optionFilterProp: 'label' },
        span: 12,
    },
    {
        name: 'buyer_customer_id',
        label: 'Người mua / thuê',
        type: 'select',
        options: customerOptions,
        rules: [{ required: true }],
        props: { optionFilterProp: 'label' },
        span: 6,
    },
    {
        name: 'seller_customer_id',
        label: 'Người bán / cho thuê',
        type: 'select',
        options: customerOptions,
        rules: [{ required: true }],
        props: { optionFilterProp: 'label' },
        span: 6,
    },
    {
        name: 'transaction_value',
        label: 'Giá trị',
        type: 'number',
        rules: [{ required: true }],
        props: { min: 0 },
        span: 4,
    },
    {
        name: 'service_fee',
        label: 'Phí',
        type: 'number',
        props: { min: 0 },
        span: 4,
    },
    {
        name: 'discount',
        label: 'Giảm giá',
        type: 'number',
        props: { min: 0 },
        span: 4,
    },
    {
        name: 'deposit_amount',
        label: 'Tiền cọc',
        type: 'number',
        props: { min: 0 },
        span: 4,
    },
    {
        name: 'paid_amount',
        label: 'Đã thanh toán',
        type: 'number',
        props: { min: 0 },
        span: 4,
    },
    {
        name: 'refunded_amount',
        label: 'Đã hoàn',
        type: 'number',
        props: { min: 0 },
        span: 4,
    },
    {
        name: 'transaction_date',
        label: 'Ngày giao dịch',
        type: 'date',
        rules: [{ required: true }],
        span: 6,
        submitTransform: (value) => value?.format('YYYY-MM-DD'),
    },
    {
        name: 'due_date',
        label: 'Hạn thanh toán',
        type: 'date',
        span: 6,
        submitTransform: (value) => value?.format('YYYY-MM-DD'),
    },
    {
        name: 'rental_start_at',
        label: 'Bắt đầu thuê',
        type: 'date',
        rules: [{ required: true }],
        props: { showTime: true },
        span: 6,
        hidden: (_, { values }) => values.transaction_type !== 'rental',
        submitTransform: (value) => value?.toISOString(),
    },
    {
        name: 'rental_end_at',
        label: 'Kết thúc thuê',
        type: 'date',
        rules: [{ required: true }],
        props: { showTime: true },
        span: 6,
        hidden: (_, { values }) => values.transaction_type !== 'rental',
        submitTransform: (value) => value?.toISOString(),
    },
    { name: 'payment_method', label: 'Phương thức thanh toán', span: 6 },
    { name: 'note', label: 'Ghi chú', type: 'textarea', rows: 4, span: 12 },
]
