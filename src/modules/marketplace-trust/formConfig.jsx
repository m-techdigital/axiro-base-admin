import {
    CASE_STATUS_OPTIONS,
    CONTENT_TYPE_OPTIONS,
    DOCUMENT_STATUS_OPTIONS,
    REVIEW_STATUS_OPTIONS,
} from '@/constants/options'
import { Input } from 'antd'

export const trustContentDefaultValues = {
    type: 'guide',
    status: 'draft',
    requires_acceptance: false,
}

export const trustContentFields = [
    { name: 'id', type: 'hidden' },
    {
        name: 'type',
        label: 'Loại',
        options: CONTENT_TYPE_OPTIONS,
        rules: [{ required: true }],
        span: 6,
        type: 'select',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        options: DOCUMENT_STATUS_OPTIONS,
        rules: [{ required: true }],
        span: 6,
        type: 'select',
    },
    { name: 'slug', label: 'Slug', rules: [{ required: true }], span: 12 },
    { name: 'title', label: 'Tiêu đề', rules: [{ required: true }] },
    { name: 'summary', label: 'Tóm tắt', rows: 2, type: 'textarea' },
    {
        name: 'body',
        label: 'Nội dung',
        rows: 12,
        rules: [{ required: true }],
        type: 'textarea',
    },
    {
        name: 'requires_acceptance',
        text: 'Yêu cầu khách hàng xác nhận',
        type: 'checkbox',
        span: 12,
    },
    {
        name: 'effective_at',
        label: 'Ngày hiệu lực',
        render: () => <Input type="datetime-local" />,
        span: 12,
    },
]

export const createTrustModerationFields = ({ tab }) => [
    {
        name: 'status',
        label: 'Trạng thái',
        options:
            tab === 'reviews'
                ? REVIEW_STATUS_OPTIONS
                : CASE_STATUS_OPTIONS.filter(({ value }) =>
                      ['reviewing', 'resolved', 'dismissed'].includes(value),
                  ),
        rules: [{ required: true }],
        type: 'select',
    },
    {
        name: 'note',
        label: tab === 'reviews' ? 'Ghi chú kiểm duyệt' : 'Kết quả xử lý',
        rows: 5,
        rules: tab === 'risks' ? [{ required: true }] : [],
        type: 'textarea',
    },
]

export const createTrustModerationInitialValues = ({ selected, tab }) => ({
    status: tab === 'reviews' ? selected?.status || 'published' : 'reviewing',
})
