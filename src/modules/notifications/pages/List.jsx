import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import { Tag, message } from 'antd'
import { useNavigate } from 'react-router-dom'

import {
    BaseActionGroup,
    BaseButton,
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
    )
}
