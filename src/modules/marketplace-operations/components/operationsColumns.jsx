import { EditOutlined, ToolOutlined } from '@ant-design/icons'
import { BaseIconAction } from '@/components/base'
import {
    statusColor,
    statusLabel,
    valueLabel,
} from '@/contracts/marketplaceLabels'
import { Tag } from 'antd'

export const createCaseColumns = ({ onSelect }) => [
    { title: 'Mã', dataIndex: 'code', width: 150 },
    {
        title: 'Loại',
        dataIndex: 'case_type',
        render: (value) => <Tag>{valueLabel(value)}</Tag>,
    },
    { title: 'Giao dịch', render: (_, row) => row.transaction?.code || '—' },
    { title: 'Người gửi', render: (_, row) => row.opened_by?.name || '—' },
    {
        title: 'Ưu tiên',
        dataIndex: 'priority',
        render: (value) => (
            <Tag
                color={
                    value === 'urgent'
                        ? 'red'
                        : value === 'high'
                          ? 'orange'
                          : undefined
                }
            >
                {statusLabel(value, valueLabel(value, value || '—'))}
            </Tag>
        ),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (value) => (
            <Tag color={statusColor(value)}>
                {statusLabel(value, valueLabel(value, value || '—'))}
            </Tag>
        ),
    },
    { title: 'Cập nhật', dataIndex: 'last_message_at', width: 180 },
    {
        title: '',
        fixed: 'right',
        width: 90,
        render: (_, row) => (
            <BaseIconAction
                icon={<ToolOutlined />}
                label="Xử lý"
                onClick={() => onSelect(row)}
            />
        ),
    },
]

export const createFeeColumns = ({ onEdit }) => [
    { title: 'Mã', dataIndex: 'code' },
    { title: 'Tên', dataIndex: 'name' },
    {
        title: 'Loại',
        dataIndex: 'transaction_type',
        render: (value) => (value ? valueLabel(value) : 'Tất cả'),
    },
    {
        title: 'Phí người mua',
        render: (_, row) => `${row.buyer_fee_rate}% + ${row.buyer_fixed_fee}`,
    },
    {
        title: 'Phí người bán',
        render: (_, row) => `${row.seller_fee_rate}% + ${row.seller_fixed_fee}`,
    },
    {
        title: 'Thuế phí',
        dataIndex: 'tax_rate',
        render: (value) => `${value}%`,
    },
    {
        title: 'Hiệu lực',
        dataIndex: 'is_active',
        render: (value) => (
            <Tag color={value ? 'green' : undefined}>
                {value ? 'Đang dùng' : 'Tạm dừng'}
            </Tag>
        ),
    },
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

export const snapshotColumns = [
    {
        title: 'Giao dịch',
        render: (_, row) => row.transaction?.code || row.transaction_id,
    },
    {
        title: 'Giai đoạn',
        dataIndex: 'stage',
        render: (value) => <Tag>{valueLabel(value)}</Tag>,
    },
    {
        title: 'Người ghi nhận',
        render: (_, row) =>
            row.customer?.name || `${row.actor_type} #${row.actor_id}`,
    },
    { title: 'Số ảnh', render: (_, row) => row.images?.length || 0 },
    { title: 'Thời điểm', dataIndex: 'captured_at' },
    { title: 'Ghi chú', dataIndex: 'note', ellipsis: true },
]
