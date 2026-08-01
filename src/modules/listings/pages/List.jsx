import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Input, Tag, message } from 'antd'
import { useState } from 'react'

import {
    BaseActionGroup,
    BaseConfirmActionButton,
    BaseFilter,
    BaseIconAction,
    BaseListView,
    BaseModal,
    BasePageHeader,
    Money,
} from '@/components/base'
import { useBaseFilters, useList } from '@/hooks'

import { statusColor, statusLabel } from '../../../contracts/marketplaceLabels'
import service from '../service'

const filterFields = [
    {
        name: 'keyword',
        label: 'Mã hoặc tiêu đề',
        type: 'search',
        placeholder: 'Mã hoặc tiêu đề tin đăng',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { value: 'pending', label: 'Chờ duyệt' },
            { value: 'published', label: 'Đang hiển thị' },
            { value: 'rejected', label: 'Đã từ chối' },
            { value: 'reserved', label: 'Đã giữ chỗ' },
        ],
    },
    {
        name: 'listing_type',
        label: 'Loại tin',
        type: 'select',
        options: [
            { value: 'sale', label: 'Bán' },
            { value: 'rental', label: 'Cho thuê' },
        ],
    },
]

export default function ListingList() {
    const list = useList(service, { page: 1, per_page: 20 })
    const filters = useBaseFilters({
        defaultParams: { page: 1, per_page: 20 },
        onSearch: list.setParams,
        onReset: list.setParams,
    })
    const [rejecting, setRejecting] = useState(null)
    const [reason, setReason] = useState('')

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
        { title: 'Tin đăng', dataIndex: 'title' },
        { title: 'Chủ tin', render: (_, record) => record.owner?.name },
        {
            title: 'Loại',
            dataIndex: 'listing_type',
            render: (value) => (
                <Tag>{value === 'sale' ? 'Bán' : 'Cho thuê'}</Tag>
            ),
        },
        {
            title: 'Giá / kỳ hạn',
            render: (_, record) =>
                record.listing_type === 'sale' ? (
                    <Money value={record.sale_price} />
                ) : (
                    <div>
                        <Money value={record.rental_price} />
                        <small style={{ display: 'block' }}>
                            {(record.rental_rates || record.rentalRates || [])
                                .map(
                                    (rate) =>
                                        `${rate.label}: ${Number(rate.price).toLocaleString('vi-VN')}đ`,
                                )
                                .join(' | ') || 'Chưa khai báo gói thuê'}
                        </small>
                    </div>
                ),
        },
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
                    {record.status !== 'published' ? (
                        <BaseConfirmActionButton
                            icon={<CheckOutlined />}
                            onConfirm={() =>
                                act(
                                    () => service.approve(record.id),
                                    'Đã duyệt tin đăng',
                                )
                            }
                            title="Duyệt tin đăng này?"
                            tooltip="Duyệt"
                        />
                    ) : null}
                    <BaseIconAction
                        danger
                        icon={<CloseOutlined />}
                        label="Từ chối"
                        onClick={() => {
                            setRejecting(record)
                            setReason('')
                        }}
                    />
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
                        description="Duyệt, từ chối và theo dõi trạng thái tin đăng MBN."
                        title="Tin đăng MBN"
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
            <BaseModal
                okButtonProps={{ disabled: !reason.trim() }}
                onCancel={() => setRejecting(null)}
                onOk={() =>
                    act(
                        () => service.reject(rejecting.id, reason),
                        'Đã từ chối tin đăng',
                    ).then(() => setRejecting(null))
                }
                open={Boolean(rejecting)}
                title="Từ chối tin đăng"
            >
                <Input.TextArea
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Nêu rõ lý do để khách hàng chỉnh sửa"
                    rows={4}
                    value={reason}
                />
            </BaseModal>
        </>
    )
}
