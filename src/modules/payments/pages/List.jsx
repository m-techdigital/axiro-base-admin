import { CheckOutlined } from '@ant-design/icons'
import { Tag, message } from 'antd'
import { useState } from 'react'

import {
    BaseActionGroup,
    BaseFilter,
    BaseIconAction,
    BaseListView,
    BasePageHeader,
    BaseReviewActionModal,
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
        onReset: list.setParams,
        onSearch: list.setParams,
    })
    const [reviewRecord, setReviewRecord] = useState(null)
    const [reviewLoading, setReviewLoading] = useState(false)

    const review = async (action, reason) => {
        if (!reviewRecord) return

        setReviewLoading(true)
        try {
            if (action === 'confirm') {
                await service.confirm(reviewRecord.id)
            } else {
                await service.reject(reviewRecord.id, reason)
            }

            message.success(
                action === 'confirm'
                    ? 'Đã xác nhận thanh toán'
                    : 'Đã từ chối thanh toán',
            )
            setReviewRecord(null)
            await list.reload()
        } catch (error) {
            const details = error?.errors
                ? Object.values(error.errors).flat().join(' ')
                : error.message

            message.error(
                details ||
                    'Không thể xử lý thanh toán. Hãy kiểm tra trạng thái giao dịch, số tiền và chứng từ.',
            )
        } finally {
            setReviewLoading(false)
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
                    {['submitted', 'pending'].includes(record.status) ? (
                        <BaseIconAction
                            icon={<CheckOutlined />}
                            label="Đối soát thanh toán"
                            onClick={() => setReviewRecord(record)}
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
            <BaseReviewActionModal
                approveText="Xác nhận thanh toán"
                description="Chỉ xác nhận khi số tiền, phương thức và chứng từ đã khớp. Nếu từ chối, lý do là bắt buộc."
                loading={reviewLoading}
                onApprove={() => review('confirm')}
                onCancel={() => setReviewRecord(null)}
                onReject={(reason) => review('reject', reason)}
                open={Boolean(reviewRecord)}
                record={reviewRecord}
                summary={
                    reviewRecord
                        ? [
                              {
                                  label: 'Mã thanh toán',
                                  value: reviewRecord.code,
                              },
                              {
                                  label: 'Giao dịch',
                                  value: reviewRecord.transaction?.code,
                              },
                              {
                                  label: 'Khách hàng',
                                  value: reviewRecord.customer?.name,
                              },
                              {
                                  label: 'Loại thanh toán',
                                  value: valueLabel(reviewRecord.payment_type),
                              },
                              {
                                  label: 'Trạng thái',
                                  value: reviewRecord.status,
                                  type: 'status',
                              },
                          ]
                        : []
                }
                title="Đối soát thanh toán"
            />
        </>
    )
}
