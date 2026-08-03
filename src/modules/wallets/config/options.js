export const walletTypeLabels = {
    deposit_confirmed: 'Nạp tiền đã xác nhận',
    transaction_payment: 'Thanh toán giao dịch',
    escrow_hold: 'Tiền giao dịch đang tạm giữ',
    escrow_release: 'Giải phóng tiền tạm giữ',
    settlement_credit: 'Tiền bán/cho thuê được ghi có',
    rental_deposit_refund_credit: 'Hoàn tiền cọc thuê',
    rental_deposit_refund_debit: 'Khấu trừ tiền cọc đang giữ',
    transaction_refund_credit: 'Hoàn tiền giao dịch',
    transaction_refund_debit: 'Giảm tiền đang giữ để hoàn',
    admin_adjustment: 'Điều chỉnh quản trị',
}

export const walletFilterFields = [
    {
        name: 'keyword',
        placeholder: 'Tìm khách hàng',
        type: 'search',
        span: { xs: 24, md: 8 },
    },
]
