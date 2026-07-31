import {
    statusColor,
    statusLabel,
    valueLabel,
} from '../../../contracts/marketplaceLabels'
import { Button, Card, Input, Space, Tag, message } from 'antd'
import { useList } from '../../../hooks/useList'
import BaseTable from '../../../components/base/BaseTable'
import PageHeader from '../../../components/base/PageHeader'
import Money from '../../../components/base/Money'
import service from '../service'
export default function PaymentList() {
    const x = useList(service, { per_page: 20 })
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
        { title: 'Giao dịch', render: (_, r) => r.transaction?.code },
        { title: 'Khách hàng', render: (_, r) => r.customer?.name },
        {
            title: 'Loại',
            dataIndex: 'payment_type',
            render: (v) => valueLabel(v),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (v) => <Money value={v} />,
        },
        { title: 'Hạn', dataIndex: 'due_date' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v) => <Tag color={statusColor(v)}>{statusLabel(v)}</Tag>,
        },
        {
            title: '',
            render: (_, r) => (
                <Space>
                    {r.status !== 'confirmed' && (
                        <Button
                            type="link"
                            onClick={() =>
                                act(() => service.confirm(r.id), 'Đã xác nhận')
                            }
                        >
                            Xác nhận
                        </Button>
                    )}
                    <Button
                        danger
                        type="link"
                        onClick={() =>
                            act(
                                () =>
                                    service.reject(
                                        r.id,
                                        'Thông tin thanh toán chưa hợp lệ.',
                                    ),
                                'Đã từ chối',
                            )
                        }
                    >
                        Từ chối
                    </Button>
                </Space>
            ),
        },
    ]
    return (
        <div className="page">
            <PageHeader title="Thanh toán giao dịch" />
            <Card>
                <Input.Search
                    placeholder="Tìm theo mã giao dịch"
                    onSearch={(transaction_id) =>
                        x.setParams((p) => ({ ...p, transaction_id, page: 1 }))
                    }
                    style={{ width: 320, marginBottom: 16 }}
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
        </div>
    )
}
