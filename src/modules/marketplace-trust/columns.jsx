import {
    EditOutlined,
    SafetyCertificateOutlined,
    ToolOutlined,
} from '@ant-design/icons'
import { BaseIconAction } from '@/components/base'
import {
    statusColor,
    statusLabel,
    valueLabel,
} from '@/contracts/marketplaceLabels'
import { Tag } from 'antd'

export const createReviewColumns = ({ onSelect }) => [
    { title: 'Giao dịch', render: (_, row) => row.transaction?.code },
    { title: 'Người đánh giá', render: (_, row) => row.reviewer?.name },
    { title: 'Đối tượng', render: (_, row) => row.reviewee?.name },
    { title: 'Điểm', dataIndex: 'rating', render: (value) => `${value}/5` },
    { title: 'Nhận xét', dataIndex: 'comment', ellipsis: true },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (value) => (
            <Tag color={statusColor(value)}>
                {statusLabel(value, valueLabel(value, value || '—'))}
            </Tag>
        ),
    },
    {
        title: 'Thao tác',
        key: 'actions',
        render: (_, row) => (
            <BaseIconAction
                icon={<SafetyCertificateOutlined />}
                label="Kiểm duyệt"
                onClick={() => onSelect(row)}
            />
        ),
    },
]

export const createContentColumns = ({ onEdit }) => [
    {
        title: 'Loại',
        dataIndex: 'type',
        render: (value) => <Tag>{valueLabel(value)}</Tag>,
    },
    { title: 'Tiêu đề', dataIndex: 'title' },
    { title: 'Slug', dataIndex: 'slug' },
    { title: 'Phiên bản', dataIndex: 'version' },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (value) => (
            <Tag color={statusColor(value)}>
                {statusLabel(value, valueLabel(value, value || '—'))}
            </Tag>
        ),
    },
    { title: 'Ngày hiệu lực', dataIndex: 'effective_at' },
    {
        title: 'Thao tác',
        key: 'actions',
        render: (_, row) => (
            <BaseIconAction
                icon={<EditOutlined />}
                label="Chỉnh sửa"
                onClick={() => onEdit(row)}
            />
        ),
    },
]

export const createRiskColumns = ({ onSelect }) => [
    { title: 'Mã', dataIndex: 'code' },
    {
        title: 'Đối tượng',
        render: (_, row) =>
            `${valueLabel(row.subject_type)} #${row.subject_id}`,
    },
    { title: 'Rule', dataIndex: 'rule_code' },
    {
        title: 'Mức',
        dataIndex: 'level',
        render: (value) => (
            <Tag
                color={
                    value === 'high' || value === 'critical'
                        ? 'red'
                        : value === 'medium'
                          ? 'orange'
                          : undefined
                }
            >
                {statusLabel(value, valueLabel(value, value || '—'))}
            </Tag>
        ),
    },
    { title: 'Lý do', dataIndex: 'reason', ellipsis: true },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (value) => (
            <Tag color={statusColor(value)}>
                {statusLabel(value, valueLabel(value, value || '—'))}
            </Tag>
        ),
    },
    {
        title: 'Thao tác',
        key: 'actions',
        render: (_, row) => (
            <BaseIconAction
                icon={<ToolOutlined />}
                label="Xử lý"
                onClick={() => onSelect(row)}
            />
        ),
    },
]
