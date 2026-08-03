import { EyeOutlined } from '@ant-design/icons'
import { BaseIconAction } from '@/components/base'
import Money from '@/components/base/Money'
import { Tag } from 'antd'
import { walletTypeLabels } from '../config/options'

export const createWalletColumns = (onOpen) => [
    { title: 'Mã', dataIndex: 'code' },
    { title: 'Khách hàng', dataIndex: 'name' },
    { title: 'Tên đăng nhập', dataIndex: 'username' },
    {
        title: 'Khả dụng',
        render: (_, row) => (
            <Money value={row.wallet?.available_balance || 0} />
        ),
    },
    {
        title: 'Tạm giữ',
        render: (_, row) => <Money value={row.wallet?.held_balance || 0} />,
    },
    {
        title: 'Tổng',
        render: (_, row) => (
            <Money
                value={
                    Number(row.wallet?.available_balance || 0) +
                    Number(row.wallet?.held_balance || 0)
                }
            />
        ),
    },
    {
        title: 'Thao tác',
        key: 'actions',
        render: (_, row) => (
            <BaseIconAction
                icon={<EyeOutlined />}
                label="Xem dòng tiền"
                onClick={() => onOpen(row)}
            />
        ),
    },
]

export const walletLedgerColumns = [
    {
        title: 'Thời gian',
        dataIndex: 'occurred_at',
        render: (value) =>
            value ? new Date(value).toLocaleString('vi-VN') : '—',
    },
    {
        title: 'Nghiệp vụ',
        dataIndex: 'type',
        render: (value) => walletTypeLabels[value] || value,
    },
    {
        title: 'Khoản',
        dataIndex: 'balance_bucket',
        render: (value) => (
            <Tag>{value === 'held' ? 'Tạm giữ' : 'Khả dụng'}</Tag>
        ),
    },
    {
        title: 'Số tiền',
        render: (_, row) => (
            <span
                style={{
                    color: row.direction === 'credit' ? '#08979c' : '#cf1322',
                }}
            >
                {row.direction === 'credit' ? '+' : '-'}
                <Money value={row.amount} />
            </span>
        ),
    },
    {
        title: 'Trước',
        render: (_, row) => (
            <Money
                value={
                    row.balance_bucket === 'held'
                        ? row.held_before
                        : row.available_before
                }
            />
        ),
    },
    {
        title: 'Sau',
        render: (_, row) => (
            <Money
                value={
                    row.balance_bucket === 'held'
                        ? row.held_after
                        : row.available_after
                }
            />
        ),
    },
    {
        title: 'Tham chiếu',
        render: (_, row) => row.external_reference || row.code,
    },
]
