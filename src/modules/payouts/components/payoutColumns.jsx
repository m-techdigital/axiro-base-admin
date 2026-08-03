import { ToolOutlined } from '@ant-design/icons'
import { BaseIconAction } from '@/components/base'
import Money from '@/components/base/Money'
import { statusColor, statusLabel, valueLabel } from '@/contracts/marketplaceLabels'
import { Tag } from 'antd'

const status = (value) => (
    <Tag color={statusColor(value)}>
        {statusLabel(value, valueLabel(value, value || '—'))}
    </Tag>
)

const actionColumn = (onSelect) => ({
    title: 'Thao tác',
    key: 'actions',
    render: (_, record) => (
        <BaseIconAction
            icon={<ToolOutlined />}
            label="Xử lý"
            onClick={() => onSelect(record)}
        />
    ),
})

export const createPayoutColumns = (active, onSelect) => {
    if (active === 'verifications') {
        return [
            { title: 'Khách hàng', render: (_, row) => row.customer?.name },
            {
                title: 'Giấy tờ',
                render: (_, row) =>
                    `${valueLabel(row.document_type)} · ${row.document_number || '—'}`,
            },
            { title: 'Trạng thái', dataIndex: 'status', render: status },
            { title: 'Ngày gửi', dataIndex: 'submitted_at' },
            actionColumn(onSelect),
        ]
    }

    if (active === 'accounts') {
        return [
            { title: 'Khách hàng', render: (_, row) => row.customer?.name },
            { title: 'Ngân hàng', dataIndex: 'bank_name' },
            { title: 'Chủ tài khoản', dataIndex: 'account_name' },
            { title: 'Số tài khoản', dataIndex: 'account_number' },
            { title: 'Trạng thái', dataIndex: 'status', render: status },
            actionColumn(onSelect),
        ]
    }

    return [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Khách hàng', render: (_, row) => row.customer?.name },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (value) => <Money value={value} />,
        },
        {
            title: 'Tài khoản',
            render: (_, row) =>
                `${row.payout_account?.bank_name || ''} · ${row.payout_account?.account_number || ''}`,
        },
        { title: 'Trạng thái', dataIndex: 'status', render: status },
        {
            title: 'Việc tiếp theo',
            render: (_, row) =>
                row.journey?.next_action?.label ||
                row.journey?.blocked_reason ||
                'Không còn thao tác',
        },
        actionColumn(onSelect),
    ]
}
