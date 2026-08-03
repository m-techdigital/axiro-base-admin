export const QR_TEMPLATE_OPTIONS = [
    { value: 'compact2', label: 'Gọn có thông tin' },
    { value: 'compact', label: 'Gọn' },
    { value: 'qr_only', label: 'Chỉ mã QR' },
    { value: 'print', label: 'Bản in' },
]

export const paymentConfigFields = [
    {
        name: 'bank_id',
        label: 'Mã ngân hàng',
        rules: [{ required: true }],
        props: { maxLength: 32, placeholder: 'Ví dụ: MB' },
        span: 4,
    },
    {
        name: 'bank_name',
        label: 'Tên ngân hàng',
        rules: [{ required: true }],
        props: { maxLength: 120 },
        span: 8,
    },
    {
        name: 'account_no',
        label: 'Số tài khoản',
        rules: [{ required: true }],
        props: { maxLength: 80 },
        span: 6,
    },
    {
        name: 'account_name',
        label: 'Tên chủ tài khoản',
        rules: [{ required: true }],
        props: { maxLength: 180 },
        span: 6,
    },
    {
        name: 'qr_template',
        label: 'Mẫu mã QR',
        type: 'select',
        options: QR_TEMPLATE_OPTIONS,
        rules: [{ required: true }],
        span: 6,
    },
    {
        name: 'transfer_prefix',
        label: 'Tiền tố nội dung chuyển khoản',
        extra: 'Chỉ dùng chữ in hoa, số, dấu gạch ngang hoặc gạch dưới.',
        rules: [
            { required: true },
            {
                pattern: /^[A-Z0-9_-]+$/,
                message: 'Tiền tố chưa đúng định dạng.',
            },
        ],
        props: { maxLength: 32, placeholder: 'MBN' },
        span: 6,
    },
]
