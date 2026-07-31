const STATUS_LABELS = {
    draft: 'Bản nháp',
    pending: 'Đang chờ',
    pending_review: 'Chờ duyệt',
    published: 'Đang hiển thị',
    reserved: 'Đã giữ chỗ',
    completed: 'Hoàn tất',
    rejected: 'Bị từ chối',
    cancelled: 'Đã hủy',
    pending_payment: 'Chờ thanh toán',
    partially_paid: 'Đã thanh toán một phần',
    paid: 'Đã thanh toán',
    handover_pending: 'Chờ xác nhận bàn giao',
    handed_over: 'Đã bàn giao',
    active: 'Đang hoạt động',
    return_pending: 'Chờ xác nhận hoàn trả',
    returned: 'Đã hoàn trả',
    disputed: 'Đang tranh chấp',
    submitted: 'Chờ đối soát',
    confirmed: 'Đã xác nhận',
    overdue: 'Quá hạn',
    unsettled: 'Chưa đối soát',
    held: 'Đang tạm giữ',
    released: 'Đã giải ngân',
    refunded: 'Đã hoàn tiền',
    open: 'Đang mở',
    reviewing: 'Đang xem xét',
    resolved: 'Đã xử lý',
    blocked: 'Đã khóa',
    inactive: 'Ngừng hoạt động',
    approved: 'Đã duyệt',
    verified: 'Đã xác minh',
    unverified: 'Chưa xác minh',
    suspended: 'Tạm khóa',
    archived: 'Lưu trữ',
    generated: 'Đã phát hành',
    accepted: 'Đã xác nhận',
    superseded: 'Đã thay thế',
}

const VALUE_LABELS = {
    purchase: 'Mua tài khoản',
    rental: 'Thuê tài khoản',
    sale: 'Bán tài khoản',
    buyer: 'Người mua',
    seller: 'Người bán',
    renter: 'Người thuê',
    lessor: 'Người cho thuê',
    installment: 'Trả góp',
    deposit: 'Đặt cọc',
    full: 'Thanh toán đủ',
    periodic: 'Theo từng chu kỳ',
    upfront: 'Thu trước toàn kỳ',
    security_deposit: 'Tiền cọc thuê',
    rental_fee: 'Tiền thuê',
    principal: 'Tiền mua tài khoản',
    bank: 'Chuyển khoản ngân hàng',
    wallet: 'Số dư ví',
    hour: 'Giờ',
    day: 'Ngày',
    week: 'Tuần',
    month: 'Tháng',
}

export const statusLabel = (value, fallback = 'Đang xử lý') =>
    STATUS_LABELS[value] || VALUE_LABELS[value] || fallback
export const valueLabel = (value, fallback = '—') =>
    VALUE_LABELS[value] ||
    STATUS_LABELS[value] ||
    (value ? String(value).replaceAll('_', ' ') : fallback)
export const statusColor = (value) => {
    if (
        [
            'completed',
            'confirmed',
            'published',
            'paid',
            'returned',
            'resolved',
            'active',
            'released',
            'refunded',
            'approved',
            'accepted',
            'verified',
        ].includes(value)
    )
        return 'green'
    if (['rejected', 'cancelled', 'blocked', 'disputed'].includes(value))
        return 'red'
    if (
        [
            'submitted',
            'pending',
            'pending_review',
            'pending_payment',
            'partially_paid',
            'handover_pending',
            'return_pending',
            'reserved',
            'held',
            'unsettled',
            'overdue',
            'reviewing',
        ].includes(value)
    )
        return 'gold'
    return 'default'
}
