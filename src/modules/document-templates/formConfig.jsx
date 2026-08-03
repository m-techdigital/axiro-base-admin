import { Alert } from 'antd'

export const emptyDocumentTemplate = {
    code: '',
    name: '',
    type: 'sale_record',
    target_module: 'transactions',
    status: 'approved',
    content_html: '',
    description: '',
}

export const documentTemplateStatusOptions = [
    { value: 'draft', label: 'Bản nháp' },
    { value: 'approved', label: 'Đang áp dụng' },
    { value: 'archived', label: 'Lưu trữ' },
]

export const createDocumentTemplateFields = ({
    documentTypes = [],
    editing = null,
} = {}) => [
    {
        name: 'code',
        label: 'Mã mẫu',
        props: { disabled: !!editing },
        rules: [{ required: true }],
        span: 8,
    },
    {
        name: 'name',
        label: 'Tên mẫu',
        rules: [{ required: true }],
        span: 16,
    },
    {
        name: 'type',
        label: 'Loại tài liệu',
        options: documentTypes,
        rules: [{ required: true }],
        span: 12,
        type: 'select',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        options: documentTemplateStatusOptions,
        span: 12,
        type: 'select',
    },
    { name: 'description', label: 'Mô tả', rows: 2, type: 'textarea' },
    {
        key: 'template-contract-note',
        render: () => (
            <Alert
                message="Mẫu đang áp dụng phải có đầy đủ thông tin các bên, đối tượng, giá trị, quyền và nghĩa vụ, bảo mật, tranh chấp và xác nhận điện tử. Khi sửa mẫu đã dùng, hãy tăng phiên bản và phát hành lại tài liệu thay vì thay đổi bản cũ."
                showIcon
                type="warning"
            />
        ),
    },
    {
        name: 'content_html',
        label: 'Nội dung HTML có trường trộn {{transaction_code}}, {{buyer_name}}...',
        props: { style: { fontFamily: 'monospace' } },
        rows: 16,
        rules: [{ required: true }],
        type: 'textarea',
    },
]
