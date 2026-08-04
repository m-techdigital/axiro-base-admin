import { EyeOutlined } from '@ant-design/icons'
import { Image, Tag, message } from 'antd'
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

import { statusColor, statusLabel } from '../../../contracts/marketplaceLabels'
import service from '../service'

const filterFields = [
    {
        name: 'keyword',
        label: 'Mã yêu cầu hoặc giao dịch ngân hàng',
        type: 'search',
        placeholder: 'Mã yêu cầu hoặc giao dịch ngân hàng',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { value: 'draft', label: 'Chờ chuyển khoản' },
            { value: 'submitted', label: 'Chờ đối soát' },
            { value: 'confirmed', label: 'Đã cộng số dư' },
            { value: 'rejected', label: 'Đã từ chối' },
        ],
    },
]

export default function WalletDepositList() {
    const list = useList(service, { page: 1, per_page: 20 })
    const filters = useBaseFilters({
        defaultParams: { page: 1, per_page: 20 },
        onReset: list.setParams,
        onSearch: list.setParams,
    })
    const [selected, setSelected] = useState(null)
    const [reviewLoading, setReviewLoading] = useState(false)

    const review = async (action, reason) => {
        if (!selected) return

        setReviewLoading(true)
        try {
            if (action === 'confirm') {
                await service.confirm(selected.id)
            } else {
                await service.reject(selected.id, reason)
            }

            message.success(
                action === 'confirm'
                    ? 'Đã xác nhận và cộng số dư'
                    : 'Đã từ chối yêu cầu nạp tiền',
            )
            setSelected(null)
            await list.reload()
        } catch (error) {
            message.error(error.message)
        } finally {
            setReviewLoading(false)
        }
    }

    const columns = [
        { title: 'Mã yêu cầu', dataIndex: 'code' },
        { title: 'Khách hàng', render: (_, record) => record.customer?.name },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (value) => <Money value={value} />,
        },
        {
            title: 'Chứng từ',
            render: (_, record) =>
                record.proof_image_url ? (
                    <Image src={record.proof_image_url} width={64} />
                ) : (
                    'Chưa gửi'
                ),
        },
        { title: 'Mã ngân hàng', dataIndex: 'external_reference' },
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
                    <BaseIconAction
                        icon={<EyeOutlined />}
                        label="Xem và đối soát"
                        onClick={() => setSelected(record)}
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
                        description="Theo dõi chứng từ và đối soát yêu cầu nạp tiền của khách hàng."
                        title="Yêu cầu nạp tiền"
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
                approveText="Xác nhận tiền đã về"
                description="Đối chiếu chứng từ với giao dịch ngân hàng. Từ chối bắt buộc nêu rõ lý do để khách hàng bổ sung."
                loading={reviewLoading}
                onApprove={() => review('confirm')}
                onCancel={() => setSelected(null)}
                onReject={(reason) => review('reject', reason)}
                open={Boolean(selected)}
                record={selected}
                summary={
                    selected
                        ? [
                              {
                                  label: 'Mã yêu cầu',
                                  value: selected.code,
                              },
                              {
                                  label: 'Khách hàng',
                                  value: selected.customer?.name,
                              },
                              {
                                  label: 'Mã ngân hàng',
                                  value: selected.external_reference,
                              },
                              {
                                  label: 'Trạng thái',
                                  value: selected.status,
                                  type: 'status',
                              },
                          ]
                        : []
                }
                title="Đối soát yêu cầu nạp tiền"
            >
                {selected?.proof_image_url ? (
                    <Image
                        src={selected.proof_image_url}
                        style={{
                            marginTop: 16,
                            maxHeight: 360,
                            objectFit: 'contain',
                        }}
                    />
                ) : (
                    <Tag style={{ marginTop: 16 }}>
                        Khách hàng chưa gửi chứng từ
                    </Tag>
                )}
            </BaseReviewActionModal>
        </>
    )
}
