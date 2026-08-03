export const notificationFilterFields = [
    { name: 'keyword', label: 'Nội dung / mã giao dịch', type: 'search' },
    { name: 'type', label: 'Loại thông báo', type: 'search' },
    { name: 'transaction_id', label: 'ID giao dịch', type: 'number' },
    { name: 'customer_id', label: 'ID khách hàng', type: 'number' },
    {
        name: 'read_status',
        label: 'Trạng thái đọc',
        type: 'select',
        options: [
            { value: 'unread', label: 'Chưa đọc' },
            { value: 'read', label: 'Đã đọc' },
        ],
    },
]
