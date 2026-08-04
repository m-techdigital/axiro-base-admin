import { CheckOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Tag, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import {
    BaseActionGroup,
    BaseButton,
    BaseDeleteButton,
    BaseFilter,
    BaseIconAction,
    BaseListView,
    BasePageHeader,
    BaseReviewActionModal,
    Money,
} from '@/components/base'
import {
    statusColor,
    statusLabel,
    valueLabel,
} from '@/contracts/marketplaceLabels'
import { useBaseFilters, useList } from '@/hooks'

import service from '../service'

const filterFields = [
    {
        name: 'game_code',
        label: 'Trò chơi',
        type: 'select',
        options: [
            { value: 'ninja_school', label: 'Ninja School' },
            { value: 'dragon_ball', label: 'Ngọc Rồng' },
            { value: 'avatar', label: 'Avatar' },
        ],
    },
    {
        name: 'product_type',
        label: 'Loại sản phẩm',
        type: 'select',
        options: [
            { value: 'game_account', label: 'Tài khoản trò chơi' },
            { value: 'item', label: 'Vật phẩm' },
            { value: 'currency', label: 'Tiền tệ trong game' },
            { value: 'service', label: 'Dịch vụ' },
        ],
    },
    {
        name: 'keyword',
        label: 'Từ khóa',
        type: 'search',
        placeholder: 'Tìm theo mã hoặc tên sản phẩm',
    },
    {
        name: 'offer_mode',
        label: 'Mục đích',
        type: 'select',
        options: [
            { value: 'sell', label: 'Bán' },
            { value: 'rent', label: 'Cho thuê' },
            { value: 'installment', label: 'Trả góp' },
        ],
    },
    {
        name: 'availability_status',
        label: 'Khả dụng',
        type: 'select',
        options: [
            { value: 'available', label: 'Sẵn sàng' },
            { value: 'held', label: 'Đang giữ' },
            { value: 'transacting', label: 'Đang giao dịch' },
            { value: 'rented', label: 'Đang cho thuê' },
            { value: 'sold', label: 'Đã bán' },
            { value: 'suspended', label: 'Tạm khóa' },
        ],
    },
    {
        name: 'availability_version',
        label: 'Phiên bản khả dụng',
        type: 'number',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { value: 'active', label: 'Đang hoạt động' },
            { value: 'inactive', label: 'Tạm ngưng' },
        ],
    },
]

export default function ProductList() {
    const navigate = useNavigate()
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
            if (action === 'approve') {
                await service.approve(reviewRecord.id)
            } else {
                await service.reject(reviewRecord.id, reason)
            }

            message.success(
                action === 'approve'
                    ? 'Đã duyệt sản phẩm'
                    : 'Đã từ chối sản phẩm',
            )
            setReviewRecord(null)
            await list.reload()
        } catch (error) {
            message.error(error.message)
        } finally {
            setReviewLoading(false)
        }
    }

    const remove = async (record) => {
        try {
            await service.delete(record.id)
            message.success('Đã xóa sản phẩm')
            await list.reload()
        } catch (error) {
            message.error(error.message)
        }
    }

    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tên sản phẩm', dataIndex: 'name' },
        {
            title: 'Trò chơi',
            dataIndex: 'game_code',
            render: (value) => valueLabel(value),
        },
        {
            title: 'Loại sản phẩm',
            dataIndex: 'product_type',
            render: (value) => valueLabel(value),
        },
        {
            title: 'Mục đích',
            dataIndex: 'offer_modes',
            render: (values = [], record) => (
                <>
                    {values.map((value) => (
                        <Tag key={value}>{valueLabel(value)}</Tag>
                    ))}
                    {record.installment_enabled ? <Tag>Trả góp</Tag> : null}
                </>
            ),
        },
        {
            title: 'Khả dụng',
            dataIndex: 'availability_status',
            render: (value, record) => (
                <>
                    <Tag color={statusColor(value)}>
                        {statusLabel(value, valueLabel(value))}
                    </Tag>
                    <small>v{record.availability_version || 1}</small>
                </>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'approval_status',
            render: (value) => (
                <Tag color={statusColor(value)}>
                    {statusLabel(value, valueLabel(value))}
                </Tag>
            ),
        },
        {
            title: 'Giá bán / thuê',
            key: 'prices',
            render: (_, record) => (
                <>
                    {(record.offer_modes || []).includes('sell') ? (
                        <Money value={record.sale_price} />
                    ) : null}
                    {(record.offer_modes || []).includes('sell') &&
                    (record.offer_modes || []).includes('rent')
                        ? ' / '
                        : null}
                    {(record.offer_modes || []).includes('rent') ? (
                        <Money value={record.rental_price} />
                    ) : null}
                </>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            fixed: 'right',
            render: (_, record) => (
                <BaseActionGroup>
                    <BaseIconAction
                        icon={<EditOutlined />}
                        label="Chỉnh sửa"
                        onClick={() => navigate(`/products/${record.id}/edit`)}
                    />
                    {record.approval_status === 'pending' ? (
                        <BaseIconAction
                            icon={<CheckOutlined />}
                            label="Xử lý duyệt sản phẩm"
                            onClick={() => setReviewRecord(record)}
                        />
                    ) : null}
                    <BaseDeleteButton
                        entityLabel="sản phẩm"
                        onConfirm={() => remove(record)}
                        tooltip="Xóa"
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
                        actions={
                            <BaseButton
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/products/new')}
                                type="primary"
                            >
                                Tạo sản phẩm
                            </BaseButton>
                        }
                        description="Quản lý sản phẩm theo trò chơi, loại sản phẩm và loại giao dịch được hỗ trợ."
                        title="Sản phẩm"
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
                description="Duyệt để sản phẩm được phép hiển thị; từ chối phải nêu rõ nội dung khách hàng cần chỉnh sửa."
                loading={reviewLoading}
                onApprove={() => review('approve')}
                onCancel={() => setReviewRecord(null)}
                onReject={(reason) => review('reject', reason)}
                open={Boolean(reviewRecord)}
                record={reviewRecord}
                summary={
                    reviewRecord
                        ? [
                              {
                                  label: 'Mã sản phẩm',
                                  value: reviewRecord.code,
                              },
                              {
                                  label: 'Tên sản phẩm',
                                  value: reviewRecord.name,
                              },
                              {
                                  label: 'Trò chơi',
                                  value: valueLabel(reviewRecord.game_code),
                              },
                              {
                                  label: 'Trạng thái',
                                  value: reviewRecord.approval_status,
                                  type: 'status',
                              },
                          ]
                        : []
                }
                title="Duyệt sản phẩm"
            />
        </>
    )
}
