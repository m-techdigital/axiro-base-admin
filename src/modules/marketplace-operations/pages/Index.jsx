import { CASE_PRIORITY_OPTIONS, CASE_STATUS_OPTIONS } from '@/constants/options'
import { EditOutlined, ToolOutlined } from '@ant-design/icons'
import {
    BaseForm,
    BaseIconAction,
    BaseModal,
    BaseTable,
    BaseButton,
} from '@/components/base'
import {
    Card,
    Checkbox,
    Input,
    InputNumber,
    Select,
    Space,
    Tabs,
    Tag,
    message,
} from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeader from '../../../components/base/PageHeader'
import Money from '../../../components/base/Money'
import service from '../service'

const unwrap = (response) => response?.data?.data || response?.data || {}
const rowsOf = (response) => {
    const payload = unwrap(response)
    return Array.isArray(payload) ? payload : payload?.data || []
}
const CASE_TYPES = [
    'support',
    'cancellation',
    'refund',
    'handover_issue',
    'return_issue',
    'payment_issue',
    'dispute',
    'appeal',
]
const CASE_STATUSES = [
    'open',
    'triaged',
    'waiting_customer',
    'waiting_counterparty',
    'reviewing',
    'resolved',
    'rejected',
    'cancelled',
]

export default function MarketplaceOperationsPage() {
    const [tab, setTab] = useState('cases')
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [feeOpen, setFeeOpen] = useState(false)
    const [form] = BaseForm.useForm()

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response =
                tab === 'fees'
                    ? await service.feePolicies()
                    : tab === 'snapshots'
                      ? await service.snapshots()
                      : await service.cases()
            setRows(rowsOf(response))
        } catch (error) {
            message.error(error.message || 'Không thể tải dữ liệu.')
        } finally {
            setLoading(false)
        }
    }, [tab])
    useEffect(() => {
        load()
    }, [load])

    const caseColumns = useMemo(
        () => [
            { title: 'Mã', dataIndex: 'code', width: 150 },
            {
                title: 'Loại',
                dataIndex: 'case_type',
                render: (value) => <Tag>{value}</Tag>,
            },
            {
                title: 'Giao dịch',
                render: (_, row) => row.transaction?.code || '—',
            },
            {
                title: 'Người gửi',
                render: (_, row) => row.opened_by?.name || '—',
            },
            {
                title: 'Ưu tiên',
                dataIndex: 'priority',
                render: (value) => (
                    <Tag
                        color={
                            value === 'urgent'
                                ? 'red'
                                : value === 'high'
                                  ? 'orange'
                                  : undefined
                        }
                    >
                        {value}
                    </Tag>
                ),
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                render: (value) => <Tag>{value}</Tag>,
            },
            { title: 'Cập nhật', dataIndex: 'last_message_at', width: 180 },
            {
                title: '',
                fixed: 'right',
                width: 90,
                render: (_, row) => (
                    <BaseIconAction
                        icon={<ToolOutlined />}
                        label="Xử lý"
                        onClick={() => setSelected(row)}
                    />
                ),
            },
        ],
        [],
    )
    const feeColumns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tên', dataIndex: 'name' },
        {
            title: 'Loại',
            dataIndex: 'transaction_type',
            render: (v) => v || 'Tất cả',
        },
        {
            title: 'Phí người mua',
            render: (_, r) => `${r.buyer_fee_rate}% + ${r.buyer_fixed_fee}`,
        },
        {
            title: 'Phí người bán',
            render: (_, r) => `${r.seller_fee_rate}% + ${r.seller_fixed_fee}`,
        },
        { title: 'Thuế phí', dataIndex: 'tax_rate', render: (v) => `${v}%` },
        {
            title: 'Hiệu lực',
            dataIndex: 'is_active',
            render: (v) => (
                <Tag color={v ? 'green' : undefined}>
                    {v ? 'Đang dùng' : 'Tạm dừng'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, r) => (
                <BaseIconAction
                    icon={<EditOutlined />}
                    label="Chỉnh sửa"
                    onClick={() => {
                        form.setFieldsValue(r)
                        setFeeOpen(true)
                    }}
                />
            ),
        },
    ]
    const snapshotColumns = [
        {
            title: 'Giao dịch',
            render: (_, r) => r.transaction?.code || r.transaction_id,
        },
        {
            title: 'Giai đoạn',
            dataIndex: 'stage',
            render: (v) => <Tag>{v}</Tag>,
        },
        {
            title: 'Người ghi nhận',
            render: (_, r) =>
                r.customer?.name || `${r.actor_type} #${r.actor_id}`,
        },
        { title: 'Số ảnh', render: (_, r) => r.images?.length || 0 },
        { title: 'Thời điểm', dataIndex: 'captured_at' },
        { title: 'Ghi chú', dataIndex: 'note', ellipsis: true },
    ]

    const saveFee = async (values) => {
        try {
            const payload = {
                ...values,
                buyer_fixed_fee: values.buyer_fixed_fee || 0,
                seller_fixed_fee: values.seller_fixed_fee || 0,
                tax_rate: values.tax_rate || 0,
                priority: values.priority || 100,
                is_active: Boolean(values.is_active),
            }
            if (values.id) await service.updateFeePolicy(values.id, payload)
            else await service.createFeePolicy(payload)
            message.success('Đã lưu chính sách phí.')
            setFeeOpen(false)
            form.resetFields()
            load()
        } catch (error) {
            message.error(error.message || 'Không thể lưu chính sách phí.')
        }
    }
    const updateCase = async (values) => {
        try {
            await service.updateCase(selected.id, values)
            message.success('Đã cập nhật yêu cầu.')
            setSelected(null)
            load()
        } catch (error) {
            message.error(error.message || 'Không thể cập nhật yêu cầu.')
        }
    }

    return (
        <div className="page">
            <PageHeader
                title="Vận hành Marketplace"
                subtitle="Chính sách phí, trung tâm yêu cầu và biên bản hiện trạng."
            />
            <Card>
                <Tabs
                    activeKey={tab}
                    onChange={setTab}
                    tabBarExtraContent={
                        tab === 'fees' ? (
                            <BaseButton
                                type="primary"
                                onClick={() => {
                                    form.resetFields()
                                    form.setFieldsValue({
                                        buyer_fee_rate: 0,
                                        buyer_fixed_fee: 0,
                                        seller_fee_rate: 0,
                                        seller_fixed_fee: 0,
                                        tax_rate: 0,
                                        priority: 100,
                                        is_active: true,
                                    })
                                    setFeeOpen(true)
                                }}
                            >
                                Thêm chính sách phí
                            </BaseButton>
                        ) : null
                    }
                    items={[
                        { key: 'cases', label: 'Trung tâm yêu cầu' },
                        { key: 'fees', label: 'Chính sách phí' },
                        { key: 'snapshots', label: 'Biên bản hiện trạng' },
                    ]}
                />
                <BaseTable
                    rowKey="id"
                    loading={loading}
                    dataSource={rows}
                    columns={
                        tab === 'fees'
                            ? feeColumns
                            : tab === 'snapshots'
                              ? snapshotColumns
                              : caseColumns
                    }
                    scroll={{ x: 1050 }}
                />
            </Card>
            <BaseModal
                open={feeOpen}
                onCancel={() => setFeeOpen(false)}
                footer={null}
                title="Chính sách phí"
                width={760}
                destroyOnClose
            >
                <BaseForm form={form} layout="vertical" onFinish={saveFee}>
                    <BaseForm.Item name="id" hidden>
                        <Input />
                    </BaseForm.Item>
                    <Space align="start" wrap>
                        <BaseForm.Item
                            name="code"
                            label="Mã"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="name"
                            label="Tên"
                            rules={[{ required: true }]}
                        >
                            <Input style={{ width: 260 }} />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="transaction_type"
                            label="Loại giao dịch"
                        >
                            <Select
                                allowClear
                                style={{ width: 150 }}
                                options={[
                                    { value: 'purchase', label: 'Mua bán' },
                                    { value: 'rental', label: 'Cho thuê' },
                                ]}
                            />
                        </BaseForm.Item>
                    </Space>
                    <Space align="start" wrap>
                        <BaseForm.Item
                            name="buyer_fee_rate"
                            label="Phí người mua (%)"
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={0} max={100} />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="buyer_fixed_fee"
                            label="Phí cố định người mua"
                        >
                            <InputNumber min={0} />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="seller_fee_rate"
                            label="Phí người bán (%)"
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={0} max={100} />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="seller_fixed_fee"
                            label="Phí cố định người bán"
                        >
                            <InputNumber min={0} />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="tax_rate"
                            label="Thuế trên phí (%)"
                        >
                            <InputNumber min={0} max={100} />
                        </BaseForm.Item>
                    </Space>
                    <Space align="start">
                        <BaseForm.Item name="priority" label="Ưu tiên">
                            <InputNumber min={1} />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="is_active"
                            valuePropName="checked"
                            label="Trạng thái"
                        >
                            <Checkbox>Đang áp dụng</Checkbox>
                        </BaseForm.Item>
                    </Space>
                    <BaseButton type="primary" htmlType="submit">
                        Lưu chính sách
                    </BaseButton>
                </BaseForm>
            </BaseModal>
            <BaseModal
                open={Boolean(selected)}
                onCancel={() => setSelected(null)}
                footer={null}
                title={`Xử lý ${selected?.code || ''}`}
            >
                <BaseForm
                    layout="vertical"
                    onFinish={updateCase}
                    initialValues={{
                        status: selected?.status || 'reviewing',
                        priority: selected?.priority || 'normal',
                    }}
                    key={selected?.id}
                >
                    <BaseForm.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={CASE_STATUS_OPTIONS.filter(({ value }) =>
                                CASE_STATUSES.includes(value),
                            )}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item name="priority" label="Ưu tiên">
                        <Select options={CASE_PRIORITY_OPTIONS} />
                    </BaseForm.Item>
                    <BaseForm.Item name="resolution" label="Kết quả xử lý">
                        <Input.TextArea rows={5} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="transaction_status"
                        label="Kết thúc giao dịch"
                    >
                        <Select
                            allowClear
                            options={[
                                {
                                    value: 'completed',
                                    label: 'Hoàn tất và quyết toán',
                                },
                                {
                                    value: 'cancelled',
                                    label: 'Hủy và hoàn tiền',
                                },
                            ]}
                        />
                    </BaseForm.Item>
                    <BaseButton type="primary" htmlType="submit">
                        Cập nhật
                    </BaseButton>
                </BaseForm>
            </BaseModal>
        </div>
    )
}
