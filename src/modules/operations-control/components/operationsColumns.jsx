import { UnlockOutlined } from '@ant-design/icons'
import { Card, Statistic, Tag } from 'antd'

import { BaseButton, BaseIconAction } from '@/components/base'
import {
    statusColor,
    statusLabel,
    valueLabel,
} from '@/contracts/marketplaceLabels'

export function MetricCard({ title, value, suffix, danger }) {
    return (
        <Card size="small">
            <Statistic
                title={title}
                value={value ?? 0}
                suffix={suffix}
                valueStyle={danger ? { color: '#cf1322' } : undefined}
            />
        </Card>
    )
}

export function createHoldColumns({ loadTimeline, openRelease }) {
    return [
        {
            title: 'Sản phẩm',
            render: (_, row) => (
                <BaseButton type="link" onClick={() => loadTimeline(row)}>
                    {row.product?.code || `#${row.product_id}`}
                </BaseButton>
            ),
        },
        {
            title: 'Người giữ',
            render: (_, row) => row.customer?.name || 'Hệ thống',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value, row) => {
                const expired =
                    value === 'active' &&
                    row.hold_until &&
                    new Date(row.hold_until) <= new Date()

                return (
                    <Tag color={expired ? 'red' : statusColor(value)}>
                        {expired
                            ? 'Đã quá hạn chưa nhả'
                            : statusLabel(value, valueLabel(value))}
                    </Tag>
                )
            },
        },
        { title: 'Hết hạn', dataIndex: 'hold_until', width: 180 },
        {
            title: 'Phiên bản',
            render: (_, row) => row.product?.availability_version || '—',
        },
        {
            title: 'Nguồn',
            render: (_, row) =>
                row.source_type
                    ? `${row.source_type.split('\\').pop()} #${row.source_id}`
                    : '—',
        },
        {
            title: 'Thao tác',
            fixed: 'right',
            width: 90,
            render: (_, row) =>
                row.status === 'active' ? (
                    <BaseIconAction
                        danger
                        icon={<UnlockOutlined />}
                        label="Nhả hold thủ công"
                        onClick={() => openRelease(row)}
                    />
                ) : null,
        },
    ]
}

export function createQueueColumns({ inspectDocuments, navigate }) {
    return [
        { title: 'Mã', dataIndex: 'code', width: 150 },
        {
            title: 'Sản phẩm',
            render: (_, row) => row.product?.name || row.product?.code || '—',
        },
        {
            title: 'Người mua',
            render: (_, row) => row.buyer?.name || '—',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) => (
                <Tag color={statusColor(value)}>
                    {statusLabel(value, valueLabel(value))}
                </Tag>
            ),
        },
        {
            title: 'Việc tiếp theo',
            render: (_, row) =>
                row.lifecycle?.next_action ? (
                    <Tag color="blue">{row.lifecycle.next_action.label}</Tag>
                ) : (
                    '—'
                ),
        },
        { title: 'Cập nhật cuối', dataIndex: 'updated_at', width: 180 },
        {
            title: 'Chứng từ',
            render: (_, row) => (
                <BaseButton type="link" onClick={() => inspectDocuments(row)}>
                    Kiểm tra
                </BaseButton>
            ),
        },
        {
            title: 'Thao tác',
            fixed: 'right',
            render: (_, row) => (
                <BaseButton
                    type="link"
                    onClick={() => navigate(`/transactions/${row.id}`)}
                >
                    Mở hồ sơ
                </BaseButton>
            ),
        },
    ]
}
