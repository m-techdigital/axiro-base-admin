import { BaseModal } from '@/components/base'
import { statusColor, statusLabel } from '../../../contracts/marketplaceLabels'
import { Button, Card, Tag, message } from 'antd'
import { useState } from 'react'
import { useList } from '../../../hooks/useList'
import BaseTable from '../../../components/base/BaseTable'
import PageHeader from '../../../components/base/PageHeader'
import service from '../service'
export default function DisputeList() {
    const x = useList(service, { per_page: 20 }),
        [item, setItem] = useState(null)
    const resolve = async (status) => {
        try {
            await service.resolve(item.id, {
                status,
                resolution:
                    status === 'resolved'
                        ? 'Đã đối chiếu bằng chứng và xử lý theo thỏa thuận giao dịch.'
                        : 'Yêu cầu không đủ căn cứ để chấp nhận.',
                transaction_status:
                    status === 'resolved' ? 'completed' : 'paid',
            })
            message.success('Đã xử lý')
            setItem(null)
            x.reload()
        } catch (e) {
            message.error(e.message)
        }
    }
    const cols = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Giao dịch', render: (_, r) => r.transaction?.code },
        {
            title: 'Người mở',
            render: (_, r) => r.opened_by?.name || r.openedBy?.name,
        },
        { title: 'Lý do', dataIndex: 'reason' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v) => <Tag color={statusColor(v)}>{statusLabel(v)}</Tag>,
        },
        {
            title: '',
            render: (_, r) => (
                <Button type="link" onClick={() => setItem(r)}>
                    Xử lý
                </Button>
            ),
        },
    ]
    return (
        <div className="page">
            <PageHeader title="Tranh chấp" />
            <Card>
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
                title="Xử lý tranh chấp"
                open={!!item}
                onCancel={() => setItem(null)}
                footer={[
                    <Button
                        key="reject"
                        danger
                        onClick={() => resolve('rejected')}
                    >
                        Từ chối
                    </Button>,
                    <Button
                        key="resolve"
                        type="primary"
                        onClick={() => resolve('resolved')}
                    >
                        Chấp nhận và hoàn tất
                    </Button>,
                ]}
            >
                <p>
                    <b>Mô tả:</b> {item?.description}
                </p>
            </BaseModal>
        </div>
    )
}
