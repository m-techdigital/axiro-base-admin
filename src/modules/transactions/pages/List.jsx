import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Tag, message } from 'antd'
import { useNavigate } from 'react-router'

import {
    BaseActionGroup,
    BaseButton,
    BaseDeleteButton,
    BaseIconAction,
    BaseFilter,
    BaseListView,
    BasePageHeader,
    Money,
} from '@/components/base'
import { useBaseFilters, useList } from '@/hooks'

import service from '../service'
import { statusColor, statusLabel } from '../../../contracts/marketplaceLabels'

const filterFields = [
    {
        name: 'keyword',
        label: 'Từ khóa',
        type: 'search',
        placeholder: 'Tìm theo mã giao dịch',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { value: 'pending_payment', label: 'Chờ thanh toán' },
            { value: 'paid', label: 'Đã thanh toán' },
            { value: 'in_progress', label: 'Đang thực hiện' },
            { value: 'completed', label: 'Đã hoàn tất' },
            { value: 'cancelled', label: 'Đã hủy' },
        ],
    },
]

export default function TransactionList() {
    const navigate = useNavigate()
    const list = useList(service, { page: 1, per_page: 20 })
    const filters = useBaseFilters({
        defaultParams: { page: 1, per_page: 20 },
        onSearch: list.setParams,
        onReset: list.setParams,
    })

    const remove = async (record) => {
        try {
            await service.delete(record.id)
            message.success('Đã xóa giao dịch')
            await list.reload()
        } catch (error) {
            message.error(error.message)
        }
    }

    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        {
            title: 'Sản phẩm',
            render: (_, record) => record.product?.name || '—',
        },
        {
            title: 'Ngày giao dịch',
            dataIndex: 'transaction_date',
            render: (value) =>
                value
                    ? new Intl.DateTimeFormat('vi-VN').format(new Date(value))
                    : '—',
        },
        {
            title: 'Tổng thanh toán',
            dataIndex: 'total_payable',
            render: (value) => <Money value={value} />,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) => (
                <Tag color={statusColor(value)}>
                    {statusLabel(value, value || '—')}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            fixed: 'right',
            render: (_, record) => (
                <BaseActionGroup>
                    <BaseIconAction
                        icon={<EyeOutlined />}
                        label="Xem chi tiết"
                        onClick={() => navigate(`/transactions/${record.id}`)}
                    />
                    <BaseIconAction
                        icon={<EditOutlined />}
                        label="Chỉnh sửa"
                        onClick={() =>
                            navigate(`/transactions/${record.id}/edit`)
                        }
                    />
                    <BaseDeleteButton
                        entityLabel="giao dịch"
                        onConfirm={() => remove(record)}
                        tooltip="Xóa"
                    />
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
                    actions={
                        <BaseButton
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/transactions/new')}
                            type="primary"
                        >
                            Tạo giao dịch
                        </BaseButton>
                    }
                    description="Quản lý toàn bộ vòng đời giao dịch Marketplace."
                    title="Giao dịch"
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
