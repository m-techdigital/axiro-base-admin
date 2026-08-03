import {
    GAME_OPTIONS,
    PRODUCT_STATUS_OPTIONS,
    PRODUCT_TYPE_OPTIONS,
} from '@/constants/options'
import { OFFER_MODE_OPTIONS } from '@/modules/shared/enums/offer_modes.enum'
import { Checkbox } from 'antd'

export const productDefaultValues = {
    status: 'active',
    product_type: 'game_account',
    offer_modes: ['sell'],
    installment_enabled: false,
    sale_deposit_amount: 0,
    rental_deposit_amount: 0,
    installment_interval_unit: 'week',
    installment_interval_count: 1,
    rental_billing_mode: 'upfront',
}

export const installmentUnitOptions = [
    { value: 'day', label: 'Ngày' },
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
]

export const rentalUnitOptions = [
    { value: 'hour', label: 'Giờ' },
    { value: 'day', label: 'Ngày' },
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
]

const hiddenWhenNotSell = (_, { values }) =>
    !values.offer_modes?.includes('sell')
const hiddenWhenNotRent = (_, { values }) =>
    !values.offer_modes?.includes('rent')
const hiddenWhenNoInstallment = (_, { values }) =>
    !values.offer_modes?.includes('sell') || !values.installment_enabled

export const productFormFields = [
    { name: 'code', label: 'Mã', rules: [{ required: true }], span: 4 },
    {
        name: 'name',
        label: 'Tên sản phẩm',
        rules: [{ required: true }],
        span: 8,
    },
    {
        name: 'game_code',
        label: 'Trò chơi',
        type: 'select',
        options: GAME_OPTIONS,
        rules: [{ required: true }],
        span: 6,
    },
    {
        name: 'product_type',
        label: 'Loại sản phẩm',
        type: 'select',
        options: PRODUCT_TYPE_OPTIONS,
        rules: [{ required: true }],
        span: 6,
    },
    { name: 'server_name', label: 'Máy chủ', span: 4 },
    {
        name: 'level',
        label: 'Cấp độ',
        type: 'number',
        props: { min: 0 },
        span: 4,
    },
    {
        name: 'status',
        label: 'Trạng thái tài sản',
        type: 'select',
        options: PRODUCT_STATUS_OPTIONS,
        span: 4,
    },
    {
        name: 'offer_modes',
        label: 'Mục đích giao dịch',
        rules: [{ required: true, type: 'array', min: 1 }],
        span: 12,
        render: () => <Checkbox.Group options={OFFER_MODE_OPTIONS} />,
    },
    {
        name: 'sale_price',
        label: 'Giá bán',
        type: 'number',
        rules: [{ required: true }],
        props: { min: 0 },
        span: 6,
        hidden: hiddenWhenNotSell,
    },
    {
        name: 'sale_deposit_amount',
        label: 'Tiền cọc khi bán',
        type: 'number',
        props: { min: 0 },
        span: 6,
        hidden: hiddenWhenNotSell,
    },
    {
        name: 'installment_enabled',
        text: 'Cho phép trả góp',
        type: 'checkbox',
        span: 12,
        hidden: hiddenWhenNotSell,
    },
    {
        name: 'minimum_initial_payment',
        label: 'Thanh toán tối thiểu ban đầu',
        type: 'number',
        rules: [{ required: true }],
        props: { min: 0 },
        span: 4,
        hidden: hiddenWhenNoInstallment,
    },
    {
        name: 'max_installment_count',
        label: 'Số kỳ tối đa',
        type: 'number',
        rules: [{ required: true }],
        props: { min: 2, max: 12 },
        span: 4,
        hidden: hiddenWhenNoInstallment,
    },
    {
        name: 'installment_interval_unit',
        label: 'Chu kỳ trả góp',
        type: 'select',
        options: installmentUnitOptions,
        span: 4,
        hidden: hiddenWhenNoInstallment,
    },
    {
        name: 'rental_price',
        label: 'Giá thuê',
        type: 'number',
        rules: [{ required: true }],
        props: { min: 0 },
        span: 4,
        hidden: hiddenWhenNotRent,
    },
    {
        name: 'rental_price_unit',
        label: 'Đơn vị thuê',
        type: 'select',
        options: rentalUnitOptions,
        rules: [{ required: true }],
        span: 4,
        hidden: hiddenWhenNotRent,
    },
    {
        name: 'rental_deposit_amount',
        label: 'Tiền cọc thuê',
        type: 'number',
        props: { min: 0 },
        span: 4,
        hidden: hiddenWhenNotRent,
    },
    { name: 'image_url', label: 'Ảnh đại diện', span: 12 },
    {
        name: 'description',
        label: 'Mô tả',
        type: 'textarea',
        rows: 5,
        span: 12,
    },
]
