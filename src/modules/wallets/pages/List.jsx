import { BaseTable, BaseModal, BaseDrawer, BaseForm } from '@/components/base'
import {
    Button,
    Card,
    Col,
    Input,
    InputNumber,
    Row,
    Select,
    Space,
    Statistic,
    Tag,
    message,
} from 'antd'
import { useEffect, useState } from 'react'
import PageHeader from '../../../components/base/PageHeader'
import Money from '../../../components/base/Money'
import service from '../service'

const typeLabel = {
    deposit_confirmed: 'Nạp tiền đã xác nhận',
    transaction_payment: 'Thanh toán giao dịch',
    escrow_hold: 'Tiền giao dịch đang tạm giữ',
    escrow_release: 'Giải phóng tiền tạm giữ',
    settlement_credit: 'Tiền bán/cho thuê được ghi có',
    rental_deposit_refund_credit: 'Hoàn tiền cọc thuê',
    rental_deposit_refund_debit: 'Khấu trừ tiền cọc đang giữ',
    transaction_refund_credit: 'Hoàn tiền giao dịch',
    transaction_refund_debit: 'Giảm tiền đang giữ để hoàn',
    admin_adjustment: 'Điều chỉnh quản trị',
}
export default function WalletList() {
    const [rows, setRows] = useState([]),
        [loading, setLoading] = useState(true),
        [selected, setSelected] = useState(null),
        [ledger, setLedger] = useState(null),
        [drawer, setDrawer] = useState(false),
        [keyword, setKeyword] = useState('')
    const load = async () => {
        setLoading(true)
        try {
            const r = await service.list({ keyword, per_page: 100 })
            setRows(r.data?.data?.data || r.data?.data || [])
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        load()
    }, [])
    const open = async (row) => {
        setSelected(row)
        setDrawer(true)
        const r = await service.detail(row.id, { per_page: 100 })
        setLedger(r.data?.data || r.data)
    }
    const adjust = () =>
        BaseModal.confirm({
            title: 'Điều chỉnh số dư',
            icon: null,
            width: 520,
            content: (
                <AdjustForm
                    onSubmit={async (payload) => {
                        await service.adjust(selected.id, payload)
                        message.success(
                            'Đã ghi nhận điều chỉnh có nhật ký số dư trước/sau.',
                        )
                        const r = await service.detail(selected.id, {
                            per_page: 100,
                        })
                        setLedger(r.data?.data || r.data)
                        load()
                        BaseModal.destroyAll()
                    }}
                />
            ),
            footer: null,
        })
    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Khách hàng', dataIndex: 'name' },
        { title: 'Tên đăng nhập', dataIndex: 'username' },
        {
            title: 'Khả dụng',
            render: (_, r) => (
                <Money value={r.wallet?.available_balance || 0} />
            ),
        },
        {
            title: 'Tạm giữ',
            render: (_, r) => <Money value={r.wallet?.held_balance || 0} />,
        },
        {
            title: 'Tổng',
            render: (_, r) => (
                <Money
                    value={
                        Number(r.wallet?.available_balance || 0) +
                        Number(r.wallet?.held_balance || 0)
                    }
                />
            ),
        },
        {
            title: '',
            render: (_, r) => (
                <Button type="link" onClick={() => open(r)}>
                    Xem dòng tiền
                </Button>
            ),
        },
    ]
    return (
        <div className="page">
            <PageHeader
                title="Ví và dòng tiền khách hàng"
                actions={
                    <Space>
                        <Input.Search
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onSearch={load}
                            placeholder="Tìm khách hàng"
                        />
                        <Button onClick={load}>Tải lại</Button>
                    </Space>
                }
            />
            <Card>
                <BaseTable
                    rowKey="id"
                    loading={loading}
                    dataSource={rows}
                    columns={columns}
                    pagination={false}
                />
            </Card>
            <BaseDrawer
                open={drawer}
                onClose={() => setDrawer(false)}
                width={900}
                title={`Ví khách hàng ${selected?.name || ''}`}
                extra={
                    <Button type="primary" onClick={adjust}>
                        Điều chỉnh số dư
                    </Button>
                }
            >
                <Row gutter={16}>
                    {[
                        ['Số dư khả dụng', ledger?.wallet?.available_balance],
                        ['Số dư tạm giữ', ledger?.wallet?.held_balance],
                        ['Tổng tiền vào', ledger?.wallet?.lifetime_credit],
                        ['Tổng tiền ra', ledger?.wallet?.lifetime_debit],
                    ].map(([title, value]) => (
                        <Col span={6} key={title}>
                            <Card>
                                <Statistic
                                    title={title}
                                    value={Number(value || 0)}
                                    suffix="₫"
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Card
                    title="Lịch sử số dư trước và sau"
                    style={{ marginTop: 16 }}
                >
                    <BaseTable
                        rowKey="id"
                        dataSource={ledger?.transactions?.data || []}
                        pagination={false}
                        columns={[
                            {
                                title: 'Thời gian',
                                dataIndex: 'occurred_at',
                                render: (v) =>
                                    v
                                        ? new Date(v).toLocaleString('vi-VN')
                                        : '—',
                            },
                            {
                                title: 'Nghiệp vụ',
                                dataIndex: 'type',
                                render: (v) => typeLabel[v] || v,
                            },
                            {
                                title: 'Khoản',
                                dataIndex: 'balance_bucket',
                                render: (v) => (
                                    <Tag>
                                        {v === 'held' ? 'Tạm giữ' : 'Khả dụng'}
                                    </Tag>
                                ),
                            },
                            {
                                title: 'Số tiền',
                                render: (_, r) => (
                                    <span
                                        style={{
                                            color:
                                                r.direction === 'credit'
                                                    ? '#08979c'
                                                    : '#cf1322',
                                        }}
                                    >
                                        {r.direction === 'credit' ? '+' : '-'}
                                        <Money value={r.amount} />
                                    </span>
                                ),
                            },
                            {
                                title: 'Trước',
                                render: (_, r) => (
                                    <Money
                                        value={
                                            r.balance_bucket === 'held'
                                                ? r.held_before
                                                : r.available_before
                                        }
                                    />
                                ),
                            },
                            {
                                title: 'Sau',
                                render: (_, r) => (
                                    <Money
                                        value={
                                            r.balance_bucket === 'held'
                                                ? r.held_after
                                                : r.available_after
                                        }
                                    />
                                ),
                            },
                            {
                                title: 'Tham chiếu',
                                render: (_, r) =>
                                    r.external_reference || r.code,
                            },
                        ]}
                    />
                </Card>
            </BaseDrawer>
        </div>
    )
}
function AdjustForm({ onSubmit }) {
    const [form] = BaseForm.useForm()
    return (
        <BaseForm
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            initialValues={{ direction: 'credit', bucket: 'available' }}
        >
            <BaseForm.Item
                name="direction"
                label="Hướng điều chỉnh"
                rules={[{ required: true }]}
            >
                <Select
                    options={[
                        { value: 'credit', label: 'Cộng' },
                        { value: 'debit', label: 'Trừ' },
                    ]}
                />
            </BaseForm.Item>
            <BaseForm.Item
                name="bucket"
                label="Khoản số dư"
                rules={[{ required: true }]}
            >
                <Select
                    options={[
                        { value: 'available', label: 'Khả dụng' },
                        { value: 'held', label: 'Tạm giữ' },
                    ]}
                />
            </BaseForm.Item>
            <BaseForm.Item
                name="amount"
                label="Số tiền"
                rules={[{ required: true }]}
            >
                <InputNumber min={1} style={{ width: '100%' }} />
            </BaseForm.Item>
            <BaseForm.Item
                name="note"
                label="Lý do"
                rules={[{ required: true }]}
            >
                <Input.TextArea rows={3} />
            </BaseForm.Item>
            <Button type="primary" htmlType="submit" block>
                Xác nhận điều chỉnh
            </Button>
        </BaseForm>
    )
}
