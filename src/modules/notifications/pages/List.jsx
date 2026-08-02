import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import { Descriptions, Tag, Timeline, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    BaseActionGroup,
    BaseButton,
    BaseDrawer,
    BaseFilter,
    BaseIconAction,
    BaseListView,
    BasePageHeader,
} from '@/components/base'
import { useBaseFilters, useList } from '@/hooks'

import service from '../service'

const filterFields = [
    { name: 'keyword', label: 'Nội dung / mã giao dịch', type: 'search' },
    { name: 'type', label: 'Loại thông báo', type: 'search' },
    { name: 'transaction_id', label: 'ID giao dịch', type: 'number' },
    { name: 'customer_id', label: 'ID khách hàng', type: 'number' },
    {
        name: 'read_status',
        label: 'Trạng thái đọc',
        type: 'select',
        options: [
            { value: 'unread', label: 'Chưa đọc' },
            { value: 'read', label: 'Đã đọc' },
        ],
    },
]

export default function NotificationList() {
    const navigate = useNavigate()
    const [detail, setDetail] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const list = useList(service, { page: 1, per_page: 20 })
    const filters = useBaseFilters({
        defaultParams: { page: 1, per_page: 20 },
        onSearch: list.setParams,
        onReset: list.setParams,
    })

    const read = async (record) => {
        try {
            await service.read(record.id)
            await list.reload()
        } catch (error) {
            message.error(error.message)
        }
    }

    const showDetail = async (record) => {
        setDetailLoading(true)
        try {
            const response = await service.show(record.id)
            setDetail(response?.data || response)
            if (!record.read_at) {
                await service.read(record.id)
                await list.reload()
            }
        } catch (error) {
            message.error(error.message || 'Không thể tải chi tiết thông báo.')
        } finally {
            setDetailLoading(false)
        }
    }

    const columns = [
        { title: 'Thời gian', dataIndex: 'created_at', width: 180 },
        { title: 'Loại', dataIndex: 'type', width: 170 },
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
                        onClick={() => showDetail(row)}
                    />
                    {!row.read_at ? (
                        <BaseIconAction
                            icon={<CheckOutlined />}
                            label="Đánh dấu đã đọc"
                            onClick={() => read(row)}
                        />
                    ) : null}
                    {row.transaction_id ? (
                        <BaseIconAction
                            icon={<EyeOutlined />}
                            label="Mở giao dịch"
                            onClick={() =>
                                navigate(`/transactions/${row.transaction_id}`)
                            }
                        />
                    ) : null}
                </BaseActionGroup>
            ),
        },
    ]

    return (
        <>
            <BaseListView
                columns={columns}
                data={list.data}
                filters={
                    <BaseFilter
                        fields={filterFields}
                        loading={list.loading}
                        onReset={filters.reset}
                        onSearch={filters.search}
                        values={filters.filters}
                    />
                }
                header={
                    <BasePageHeader
                        title="Trung tâm thông báo"
                        description="Lọc thông báo theo giao dịch, khách hàng, loại và trạng thái đọc."
                        actions={
                            <BaseButton
                                onClick={async () => {
                                    await service.readAll()
                                    await list.reload()
                                }}
                            >
                                Đánh dấu tất cả đã đọc
                            </BaseButton>
                        }
                    />
                }
                loading={list.loading}
                onChange={(pagination) =>
                    filters.paginate(pagination.current, pagination.pageSize)
                }
                pagination={{
                    total: list.meta.pagination?.total,
                    current: list.meta.pagination?.current_page,
                    pageSize: list.meta.pagination?.per_page,
                    showSizeChanger: true,
                }}
            />
            <BaseDrawer
                open={Boolean(detail) || detailLoading}
                loading={detailLoading}
                title={detail?.title || 'Chi tiết thông báo'}
                width={760}
                onClose={() => setDetail(null)}
            >
                {detail ? (
                    <>
                        <Descriptions
                            bordered
                            column={1}
                            size="small"
                            items={[
                                {
                                    key: 'type',
                                    label: 'Loại',
                                    children: detail.type || '—',
                                },
                                {
                                    key: 'customer',
                                    label: 'Khách hàng',
                                    children: detail.customer
                                        ? `${detail.customer.code || ''} ${detail.customer.name || ''}`.trim()
                                        : '—',
                                },
                                {
                                    key: 'transaction',
                                    label: 'Giao dịch',
                                    children:
                                        detail.transaction_code ||
                                        detail.transaction?.code ||
                                        '—',
                                },
                                {
                                    key: 'message',
                                    label: 'Nội dung',
                                    children: detail.message || '—',
                                },
                                {
                                    key: 'created',
                                    label: 'Thời gian',
                                    children: detail.created_at || '—',
                                },
                            ]}
                        />
                        {detail.transaction?.events?.length ? (
                            <div style={{ marginTop: 20 }}>
                                <h3>Tiến trình giao dịch</h3>
                                <Timeline
                                    items={detail.transaction.events.map(
                                        (event) => ({
                                            children: (
                                                <>
                                                    <b>{event.title}</b>
                                                    <div>
                                                        {event.description ||
                                                            event.event_type}
                                                    </div>
                                                    <small>
                                                        {event.created_at}
                                                    </small>
                                                </>
                                            ),
                                        }),
                                    )}
                                />
                            </div>
                        ) : null}
                        {detail.transaction_id ? (
                            <BaseButton
                                onClick={() =>
                                    navigate(
                                        `/transactions/${detail.transaction_id}`,
                                    )
                                }
                            >
                                Mở hồ sơ giao dịch
                            </BaseButton>
                        ) : null}
                    </>
                ) : null}
            </BaseDrawer>
        </>
    )
}
