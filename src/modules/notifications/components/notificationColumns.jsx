import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import { BaseActionGroup, BaseIconAction } from '@/components/base'
import { valueLabel } from '@/contracts/marketplaceLabels'
import { Tag } from 'antd'

export const createNotificationColumns = ({ onRead, onShow, onNavigate }) => [
    { title: 'Thời gian', dataIndex: 'created_at', width: 180 },
    {
        title: 'Loại',
        dataIndex: 'type',
        width: 190,
        render: (value) => valueLabel(value),
    },
    { title: 'Tiêu đề', dataIndex: 'title' },
    { title: 'Khách hàng', render: (_, row) => row.customer?.name || '—' },
    {
        title: 'Giao dịch',
        render: (_, row) =>
            row.transaction_code || row.transaction?.code || '—',
    },
    {
        title: 'Trạng thái',
        render: (_, row) => (
            <Tag color={row.read_at ? 'default' : 'blue'}>
                {row.read_at ? 'Đã đọc' : 'Chưa đọc'}
            </Tag>
        ),
    },
    {
        title: 'Thao tác',
        fixed: 'right',
        render: (_, row) => (
            <BaseActionGroup>
                <BaseIconAction
                    icon={<EyeOutlined />}
                    label="Xem chi tiết"
                    onClick={() => onShow(row)}
                />
                {!row.read_at ? (
                    <BaseIconAction
                        icon={<CheckOutlined />}
                        label="Đánh dấu đã đọc"
                        onClick={() => onRead(row)}
                    />
                ) : null}
                {row.transaction_id ? (
                    <BaseIconAction
                        icon={<EyeOutlined />}
                        label="Mở giao dịch"
                        onClick={() =>
                            onNavigate(`/transactions/${row.transaction_id}`)
                        }
                    />
                ) : null}
            </BaseActionGroup>
        ),
    },
]
