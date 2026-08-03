import { Alert } from 'antd'
import { MARKETPLACE_DOCUMENT_TEMPLATE_STATUSES } from '@/generated/marketplaceOptions'

export const emptyDocumentTemplate = {
    code: '',
    name: '',
    type: 'sale_record',
    target_module: 'transactions',
    status: 'draft',
    content_html: '',
    description: '',
}

export const documentTemplateStatusOptions =
    MARKETPLACE_DOCUMENT_TEMPLATE_STATUSES

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
                message="Mẫu đang áp dụng phải có đầy đủ thông tin các bên, đối tượng, giá trị, quyền và nghĩa vụ, bảo mật, tranh chấp và xác nhận điện tử. Mẫu đã phát sinh tài liệu là bất biến. Khi sửa, hệ thống tạo phiên bản mới; tài liệu lịch sử vẫn trỏ phiên bản cũ và tài liệu phát sinh sau đó dùng phiên bản đã phát hành mới nhất."
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
