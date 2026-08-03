export const holdFilters = [
    {
        name: 'state',
        label: 'Tình trạng hold',
        type: 'select',
        options: [
            { value: 'active', label: 'Đang giữ' },
            { value: 'expiring_soon', label: 'Sắp hết hạn' },
            { value: 'expired', label: 'Đã hết hạn' },
            { value: 'released', label: 'Đã nhả' },
        ],
    },
]

export const queueFilters = [
    {
        name: 'queue',
        label: 'Hàng đợi',
        type: 'select',
        options: [
            { value: 'pending_payment', label: 'Chờ thanh toán' },
            { value: 'delivery', label: 'Chờ bàn giao' },
            { value: 'acceptance', label: 'Chờ xác nhận/hoàn trả' },
            { value: 'dispute', label: 'Đang tranh chấp' },
            { value: 'overdue_rental', label: 'Thuê quá hạn' },
            { value: 'pending_return', label: 'Chờ hoàn trả' },
            { value: 'deposit_deduction_review', label: 'Chờ quyết toán cọc' },
        ],
    },
    {
        name: 'age_minutes',
        label: 'Kẹt quá',
        type: 'select',
        options: [
            { value: 30, label: '30 phút' },
            { value: 120, label: '2 giờ' },
            { value: 1440, label: '24 giờ' },
        ],
    },
]

export const settlementFilters = [
    { name: 'date_from', label: 'Từ ngày', type: 'date' },
    { name: 'date_to', label: 'Đến ngày', type: 'date' },
    { name: 'customer_id', label: 'ID khách hàng', type: 'number' },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { value: 'completed', label: 'Hoàn tất' },
            { value: 'cancelled', label: 'Đã hủy' },
        ],
    },
]
