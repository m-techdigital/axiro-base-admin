import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Tag, message } from 'antd'

import {
    BaseActionGroup,
    BaseConfirmActionButton,
    BaseFilter,
    BaseIconAction,
    BaseListView,
    BasePageHeader,
    Money,
} from '@/components/base'
import { useBaseFilters, useList } from '@/hooks'

import {
    statusColor,
    statusLabel,
    valueLabel,
} from '../../../contracts/marketplaceLabels'
import service from '../service'

const filterFields = [
    {
        name: 'keyword',
        label: 'Mã giao dịch hoặc thanh toán',
        type: 'search',
        placeholder: 'Mã giao dịch hoặc thanh toán',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { value: 'pending', label: 'Chờ xử lý' },
            { value: 'submitted', label: 'Chờ đối soát' },
            { value: 'confirmed', label: 'Đã xác nhận' },
            { value: 'rejected', label: 'Đã từ chối' },
        ],
    },
    {
        name: 'payment_type',
        label: 'Loại thanh toán',
        type: 'select',
        options: [
            { value: 'full', label: 'Thanh toán đủ' },
            { value: 'deposit', label: 'Tiền cọc' },
            { value: 'installment', label: 'Trả góp' },
            { value: 'rental', label: 'Thuê' },
        ],
    },
]

export default function PaymentList() {
    const list = useList(service, { page: 1, per_page: 20 })
    const filters = useBaseFilters({
        defaultParams: { page: 1, per_page: 20 },
        onSearch: list.setParams,
        onReset: list.setParams,
    })

    const act = async (fn, successMessage) => {
        try {
            await fn()
            message.success(successMessage)
            await list.reload()
        } catch (error) {
            message.error(error.message)
        }
    }

    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Giao dịch', render: (_, record) => record.transaction?.code },
        { title: 'Khách hàng', render: (_, record) => record.customer?.name },
        {
            title: 'Loại',
            dataIndex: 'payment_type',
            render: (value) => valueLabel(value),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (value) => <Money value={value} />,
        },
        { title: 'Hạn', dataIndex: 'due_date' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) => (
                <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            fixed: 'right',
            render: (_, record) => (
                <BaseActionGroup>
                    {record.status !== 'confirmed' ? (
                        <BaseConfirmActionButton
                            icon={<CheckOutlined />}
                            onConfirm={() =>
                                act(
                                    () => service.confirm(record.id),
                                    'Đã xác nhận thanh toán',
                                )
                            }
                            title="Xác nhận thanh toán?"
                            tooltip="Xác nhận"
                        />
                    ) : null}
                    <BaseIconAction
                        danger
                        icon={<CloseOutlined />}
                        label="Từ chối"
                        onClick={() =>
                            act(
                                () =>
                                    service.reject(
                                        record.id,
                                        'Thông tin thanh toán chưa hợp lệ.',
                                    ),
                                'Đã từ chối thanh toán',
                            )
                        }
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
                    description="Đối soát và xác nhận các khoản thanh toán theo giao dịch."
                    title="Thanh toán giao dịch"
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
