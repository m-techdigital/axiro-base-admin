import { BaseModal } from '@/components/base'
import { statusColor, statusLabel } from '../../../contracts/marketplaceLabels'
import { Button, Card, Input, Space, Tag, message } from 'antd'
import { useState } from 'react'
import { useList } from '../../../hooks/useList'
import BaseTable from '../../../components/base/BaseTable'
import PageHeader from '../../../components/base/PageHeader'
import Money from '../../../components/base/Money'
import service from '../service'
export default function ListingList() {
    const x = useList(service, { per_page: 20 }),
        [rejecting, setRejecting] = useState(null),
        [reason, setReason] = useState('')
    const act = async (fn, msg) => {
        try {
            await fn()
            message.success(msg)
            x.reload()
        } catch (e) {
            message.error(e.message)
        }
    }
    const cols = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tin đăng', dataIndex: 'title' },
        { title: 'Chủ tin', render: (_, r) => r.owner?.name },
        {
            title: 'Loại',
            dataIndex: 'listing_type',
            render: (v) => <Tag>{v === 'sale' ? 'Bán' : 'Cho thuê'}</Tag>,
        },
        {
            title: 'Giá / kỳ hạn',
            render: (_, r) =>
                r.listing_type === 'sale' ? (
                    <Money value={r.sale_price} />
                ) : (
                    <div>
                        <Money value={r.rental_price} />
                        <small style={{ display: 'block' }}>
                            {(r.rental_rates || r.rentalRates || [])
                                .map(
                                    (x) =>
                                        `${x.label}: ${Number(x.price).toLocaleString('vi-VN')}đ`,
                                )
                                .join(' | ') || 'Chưa khai báo gói thuê'}
                        </small>
                    </div>
                ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v) => <Tag color={statusColor(v)}>{statusLabel(v)}</Tag>,
        },
        {
            title: '',
            render: (_, r) => (
                <Space>
                    {r.status !== 'published' && (
                        <Button
                            type="link"
                            onClick={() =>
                                act(() => service.approve(r.id), 'Đã duyệt')
                            }
                        >
                            Duyệt
                        </Button>
                    )}
                    <Button
                        danger
                        type="link"
                        onClick={() => {
                            setRejecting(r)
                            setReason('')
                        }}
                    >
                        Từ chối
                    </Button>
                </Space>
            ),
        },
    ]
    return (
        <div className="page">
            <PageHeader title="Tin đăng MBN" />
            <Card>
                <Input.Search
                    placeholder="Tìm mã hoặc tiêu đề"
                    onSearch={(keyword) =>
                        x.setParams((p) => ({ ...p, keyword, page: 1 }))
                    }
                    style={{ width: 340, marginBottom: 16 }}
                />
                <BaseTable
                    data={x.data}
                    columns={cols}
                    loading={x.loading}
                    pagination={{
                        total: x.meta.pagination?.total,
                        current: x.meta.pagination?.current_page,
                        pageSize: x.meta.pagination?.per_page,
                    }}
                    onChange={(p) =>
                        x.setParams((v) => ({ ...v, page: p.current }))
                    }
                />
            </Card>
            <BaseModal
                title="Từ chối tin đăng"
                open={!!rejecting}
                onCancel={() => setRejecting(null)}
                onOk={() =>
                    act(
                        () => service.reject(rejecting.id, reason),
                        'Đã từ chối',
                    ).then(() => setRejecting(null))
                }
            >
                <Input.TextArea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nêu rõ lý do để khách hàng chỉnh sửa"
                />
            </BaseModal>
        </div>
    )
}
