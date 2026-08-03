export const walletAdjustDefaultValues = {
    direction: 'credit',
    bucket: 'available',
}

export const walletAdjustFields = [
    {
        name: 'direction',
        label: 'Hướng điều chỉnh',
        type: 'select',
        options: [
            { value: 'credit', label: 'Cộng' },
            { value: 'debit', label: 'Trừ' },
        ],
        rules: [{ required: true }],
    },
    {
        name: 'bucket',
        label: 'Khoản số dư',
        type: 'select',
        options: [
            { value: 'available', label: 'Khả dụng' },
            { value: 'held', label: 'Tạm giữ' },
        ],
        rules: [{ required: true }],
    },
    {
        name: 'amount',
        label: 'Số tiền',
        type: 'number',
        props: { min: 1 },
        rules: [{ required: true }],
    },
    {
        name: 'note',
        label: 'Lý do',
        type: 'textarea',
        rows: 3,
        rules: [{ required: true }],
    },
]
