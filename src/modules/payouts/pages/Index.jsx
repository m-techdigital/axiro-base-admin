import { BaseTable, BaseModal } from '@/components/base'
import { Button, Card, Input, Space, Tabs, Tag, message } from 'antd'
import { useEffect, useState } from 'react'
import PageHeader from '../../../components/base/PageHeader'
import Money from '../../../components/base/Money'
import service from '../service'
const extract = (r) => r?.data?.data || r?.data || []
const status = (v) => <Tag>{v}</Tag>
export default function PayoutCenter() {
    const [active, setActive] = useState('withdrawals'),
        [rows, setRows] = useState([]),
        [loading, setLoading] = useState(false),
        [selected, setSelected] = useState(null),
        [note, setNote] = useState(''),
        [reference, setReference] = useState('')
    const load = async () => {
        setLoading(true)
        try {
            const r =
                active === 'verifications'
                    ? await service.verifications()
                    : active === 'accounts'
                      ? await service.accounts()
                      : await service.withdrawals()
            setRows(extract(r))
        } catch (e) {
            message.error(e.message)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        load()
    }, [active])
    const act = async (fn) => {
        try {
            await fn()
            message.success('Đã cập nhật')
            setSelected(null)
            setNote('')
            setReference('')
            load()
        } catch (e) {
            message.error(e.message)
        }
    }
    const verificationCols = [
        { title: 'Khách hàng', render: (_, r) => r.customer?.name },
        {
            title: 'Giấy tờ',
            render: (_, r) =>
                `${r.document_type || '—'} · ${r.document_number || '—'}`,
        },
        { title: 'Trạng thái', dataIndex: 'status', render: status },
        { title: 'Ngày gửi', dataIndex: 'submitted_at' },
        {
            title: '',
            render: (_, r) => (
                <Button type="link" onClick={() => setSelected(r)}>
                    Xử lý
                </Button>
            ),
        },
    ]
    const accountCols = [
        { title: 'Khách hàng', render: (_, r) => r.customer?.name },
        { title: 'Ngân hàng', dataIndex: 'bank_name' },
        { title: 'Chủ tài khoản', dataIndex: 'account_name' },
        { title: 'Số tài khoản', dataIndex: 'account_number' },
        { title: 'Trạng thái', dataIndex: 'status', render: status },
        {
            title: '',
            render: (_, r) => (
                <Button type="link" onClick={() => setSelected(r)}>
                    Xử lý
                </Button>
            ),
        },
    ]
    const withdrawalCols = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Khách hàng', render: (_, r) => r.customer?.name },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (v) => <Money value={v} />,
        },
        {
            title: 'Tài khoản',
            render: (_, r) =>
                `${r.payout_account?.bank_name || ''} · ${r.payout_account?.account_number || ''}`,
        },
        { title: 'Trạng thái', dataIndex: 'status', render: status },
        {
            title: '',
            render: (_, r) => (
                <Button type="link" onClick={() => setSelected(r)}>
                    Xử lý
                </Button>
            ),
        },
    ]
    const columns =
        active === 'verifications'
            ? verificationCols
            : active === 'accounts'
              ? accountCols
              : withdrawalCols
    return (
        <div className="page">
            <PageHeader title="Xác minh và chi trả người bán" />
            <Card>
                <Tabs
                    activeKey={active}
                    onChange={setActive}
                    items={[
                        { key: 'withdrawals', label: 'Yêu cầu rút tiền' },
                        { key: 'verifications', label: 'Xác minh người bán' },
                        { key: 'accounts', label: 'Tài khoản nhận tiền' },
                    ]}
                />
                <BaseTable
                    rowKey="id"
                    loading={loading}
                    dataSource={rows}
                    columns={columns}
                    scroll={{ x: 900 }}
                />
            </Card>
            <BaseModal
                open={!!selected}
                onCancel={() => setSelected(null)}
                footer={null}
                title="Xử lý yêu cầu"
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Input.TextArea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ghi chú xử lý"
                    />
                    {active === 'withdrawals' && (
                        <Input
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Mã tham chiếu chuyển khoản"
                        />
                    )}
                    <Space wrap>
                        {active === 'verifications' && (
                            <>
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        act(() =>
                                            service.reviewVerification(
                                                selected.id,
                                                'verify',
                                                note,
                                            ),
                                        )
                                    }
                                >
                                    Xác minh
                                </Button>
                                <Button
                                    danger
                                    onClick={() =>
                                        act(() =>
                                            service.reviewVerification(
                                                selected.id,
                                                'reject',
                                                note || 'Hồ sơ chưa hợp lệ',
                                            ),
                                        )
                                    }
                                >
                                    Từ chối
                                </Button>
                            </>
                        )}
                        {active === 'accounts' && (
                            <>
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        act(() =>
                                            service.reviewAccount(
                                                selected.id,
                                                'verify',
                                                note,
                                            ),
                                        )
                                    }
                                >
                                    Xác minh
                                </Button>
                                <Button
                                    danger
                                    onClick={() =>
                                        act(() =>
                                            service.reviewAccount(
                                                selected.id,
                                                'reject',
                                                note || 'Tài khoản chưa hợp lệ',
                                            ),
                                        )
                                    }
                                >
                                    Từ chối
                                </Button>
                            </>
                        )}
                        {active === 'withdrawals' && (
                            <>
                                <Button
                                    onClick={() =>
                                        act(() => service.approve(selected.id))
                                    }
                                >
                                    Duyệt
                                </Button>
                                <Button
                                    type="primary"
                                    disabled={!reference}
                                    onClick={() =>
                                        act(() =>
                                            service.paid(
                                                selected.id,
                                                reference,
                                            ),
                                        )
                                    }
                                >
                                    Xác nhận đã chi
                                </Button>
                                <Button
                                    danger
                                    onClick={() =>
                                        act(() =>
                                            service.reject(
                                                selected.id,
                                                note || 'Yêu cầu không hợp lệ',
                                            ),
                                        )
                                    }
                                >
                                    Từ chối
                                </Button>
                            </>
                        )}
                    </Space>
                </Space>
            </BaseModal>
        </div>
    )
}
