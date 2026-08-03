import { rentalMoneyBreakdown } from './rentalMoney'
import { statusColor, statusLabel } from '../../../contracts/marketplaceLabels'

export const transactionLabels = {
    purchase: 'Mua bán',
    rental: 'Thuê',
    pending_payment: 'Chờ thanh toán',
    partially_paid: 'Đã thanh toán một phần',
    paid: 'Đã thanh toán',
    handover_pending: 'Chờ bên nhận xác nhận',
    handed_over: 'Đã bàn giao',
    active: 'Đang thuê',
    return_pending: 'Chờ xác nhận hoàn trả',
    returned: 'Đã hoàn trả',
    completed: 'Hoàn tất',
    cancelled: 'Đã hủy',
    disputed: 'Đang tranh chấp',
}

export const buildTransactionDetailFields = (data) => [
    {
        name: 'transaction_type',
        label: 'Loại',
        type: 'option_tag',
        options: Object.entries(transactionLabels).map(([value, label]) => ({
            value,
            label,
        })),
        span: { xs: 24, md: 12 },
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'option_tag',
        labels: Object.fromEntries(
            Object.keys(transactionLabels).map((value) => [
                value,
                statusLabel(value),
            ]),
        ),
        colors: Object.fromEntries(
            Object.keys(transactionLabels).map((value) => [
                value,
                statusColor(value),
            ]),
        ),
        span: { xs: 24, md: 12 },
    },
    {
        name: ['product', 'name'],
        label: 'Tài khoản',
        type: 'text',
        span: { xs: 24, md: 12 },
    },
    {
        name: ['product', 'code'],
        label: 'Sản phẩm',
        type: 'text',
        span: { xs: 24, md: 12 },
    },
    {
        name: ['buyer', 'name'],
        label: 'Người mua / thuê',
        type: 'text',
        span: { xs: 24, md: 12 },
    },
    {
        name: ['seller', 'name'],
        label: 'Người bán / cho thuê',
        type: 'text',
        span: { xs: 24, md: 12 },
    },
    {
        name: 'total_payable',
        label: 'Tổng tiền',
        type: 'money',
        span: { xs: 24, md: 12 },
    },
    {
        name: 'paid_amount',
        label: 'Đã thanh toán',
        type: 'money',
        span: { xs: 24, md: 12 },
    },
    {
        name: 'escrow_amount',
        label: 'Đang tạm giữ',
        type: 'money',
        span: { xs: 24, md: 12 },
    },
    {
        name: 'released_amount',
        label: 'Đã giải ngân',
        type: 'money',
        span: { xs: 24, md: 12 },
    },
    {
        name: 'refunded_amount',
        label: 'Đã hoàn',
        type: 'money',
        span: { xs: 24, md: 12 },
    },
    ...(data?.transaction_type === 'rental'
        ? [
              {
                  name: 'transaction_value',
                  label: 'Tiền thuê',
                  type: 'money',
                  span: { xs: 24, md: 12 },
              },
              {
                  name: 'deposit_amount',
                  label: 'Tiền cọc',
                  type: 'money',
                  span: { xs: 24, md: 12 },
              },
              {
                  name: 'initial_payment_amount',
                  label: 'Cần thanh toán ban đầu',
                  render: (_, record) =>
                      rentalMoneyBreakdown({
                          rentalAmount: record?.transaction_value,
                          depositAmount: record?.deposit_amount,
                      }).initialAmount,
                  type: 'money',
                  span: { xs: 24, md: 12 },
              },
              {
                  name: 'rental_deposit_deduction_amount',
                  label: 'Khấu trừ tiền cọc',
                  type: 'money',
                  span: { xs: 24, md: 12 },
              },
              {
                  name: 'rental_deposit_refund_preview',
                  label: 'Cọc dự kiến hoàn lại',
                  render: (_, record) =>
                      rentalMoneyBreakdown({
                          depositAmount: record?.deposit_amount,
                          deductionAmount:
                              record?.rental_deposit_deduction_amount,
                      }).refundableAmount,
                  type: 'money',
                  span: { xs: 24, md: 12 },
              },
              {
                  name: 'rental_period_count',
                  label: 'Kỳ hạn thuê',
                  render: (value, record) =>
                      `${value || 0} ${record?.rental_period_unit || ''}`.trim(),
                  span: { xs: 24, md: 12 },
              },
              {
                  name: 'rental_billing_mode',
                  label: 'Cách thu tiền',
                  type: 'option',
                  options: [
                      { value: 'periodic', label: 'Theo từng kỳ' },
                      { value: 'full_term', label: 'Thu trước toàn kỳ' },
                  ],
                  span: { xs: 24, md: 12 },
              },
              {
                  name: 'rental_start_at',
                  label: 'Bắt đầu thuê',
                  type: 'datetime',
                  span: { xs: 24, md: 12 },
              },
              {
                  name: 'rental_end_at',
                  label: 'Hết hạn thuê',
                  type: 'datetime',
                  span: { xs: 24, md: 12 },
              },
          ]
        : []),
]
