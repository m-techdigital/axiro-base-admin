import { BaseModal } from '@/components/base'
import { statusColor, statusLabel } from '../../../contracts/marketplaceLabels'
import { Button, Card, Image, Input, Space, Tag, message } from 'antd'
import { useState } from 'react'
import { useList } from '../../../hooks/useList'
import BaseTable from '../../../components/base/BaseTable'
import PageHeader from '../../../components/base/PageHeader'
import Money from '../../../components/base/Money'
import service from '../service'
const labels = {
    draft: 'Chờ chuyển khoản',
    submitted: 'Chờ đối soát',
    confirmed: 'Đã cộng số dư',
    rejected: 'Đã từ chối',
}
export default function WalletDepositList() {
    const x = useList(service, { per_page: 20 })
    const [selected, setSelected] = useState(null),
        [note, setNote] = useState('')
    const act = async (fn, msg) => {
        try {
            await fn()
            message.success(msg)
            setSelected(null)
            setNote('')
            x.reload()
        } catch (e) {
            message.error(e.message)
        }
    }
    const cols = [
        { title: 'Mã yêu cầu', dataIndex: 'code' },
        { title: 'Khách hàng', render: (_, r) => r.customer?.name },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (v) => <Money value={v} />,
        },
        {
            title: 'Chứng từ',
            render: (_, r) =>
                r.proof_image_url ? (
                    <Image width={64} src={r.proof_image_url} />
                ) : (
                    'Chưa gửi'
                ),
        },
        { title: 'Mã ngân hàng', dataIndex: 'external_reference' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v) => <Tag color={statusColor(v)}>{statusLabel(v)}</Tag>,
        },
        {
            title: '',
            render: (_, r) => (
                <Button type="link" onClick={() => setSelected(r)}>
                    Xử lý
                </Button>
            ),
        },
    ]
    return (
        <div className="page">
            <PageHeader title="Yêu cầu nạp tiền" />
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
                open={Boolean(selected)}
                onCancel={() => setSelected(null)}
                footer={null}
                title="Đối soát yêu cầu nạp tiền"
            >
                {selected && (
                    <Space
                        direction="vertical"
                        style={{ width: '100%' }}
                        size={14}
                    >
                        <div>
                            <b>{selected.customer?.name}</b>
                            <br />
                            <span>
                                {selected.code} ·{' '}
                                <Money value={selected.amount} />
                            </span>
                        </div>
                        {selected.proof_image_url ? (
                            <Image
                                style={{ maxHeight: 420, objectFit: 'contain' }}
                                src={selected.proof_image_url}
                            />
                        ) : (
                            <Tag>Khách hàng chưa gửi chứng từ</Tag>
                        )}
                        <Input.TextArea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ghi chú khi từ chối"
                            rows={3}
                        />
                        <Space>
                            {selected.status === 'submitted' && (
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        act(
                                            () => service.confirm(selected.id),
                                            'Đã xác nhận và cộng số dư',
                                        )
                                    }
                                >
                                    Xác nhận tiền đã về
                                </Button>
                            )}
                            {['submitted', 'draft'].includes(
                                selected.status,
                            ) && (
                                <Button
                                    danger
                                    onClick={() =>
                                        act(
                                            () =>
                                                service.reject(
                                                    selected.id,
                                                    note ||
                                                        'Chứng từ chưa hợp lệ hoặc chưa nhận được tiền.',
                                                ),
                                            'Đã từ chối yêu cầu',
                                        )
                                    }
                                >
                                    Từ chối
                                </Button>
                            )}
                        </Space>
                    </Space>
                )}
            </BaseModal>
        </div>
    )
}
