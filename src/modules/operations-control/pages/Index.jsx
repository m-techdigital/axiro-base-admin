import {
    ClockCircleOutlined,
    FileDoneOutlined,
    ReloadOutlined,
    SafetyCertificateOutlined,
    SyncOutlined,
    UnlockOutlined,
    WarningOutlined,
} from '@ant-design/icons'
import { Alert, Card, Input, Space, Statistic, Tabs, Tag, message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    BaseButton,
    BaseFilter,
    BaseIconAction,
    BaseModal,
    BasePageHeader,
    BaseTable,
    Money,
} from '@/components/base'
import {
    statusColor,
    statusLabel,
    valueLabel,
} from '@/contracts/marketplaceLabels'

import service from '../service'

const unwrap = (response) => response?.data?.data || response?.data || {}
const rowsOf = (response) => {
    const payload = unwrap(response)
    return Array.isArray(payload) ? payload : payload?.data || []
}

const holdFilters = [
    {
        name: 'state',
        label: 'Tình trạng hold',
        type: 'select',
        options: [
            { value: 'active', label: 'Đang giữ' },
            { value: 'expiring_soon', label: 'Sắp hết hạn' },
            { value: 'expired', label: 'Đã hết hạn' },
            { value: 'released', label: 'Đã nhả' },
        ],
    },
]

const queueFilters = [
    {
        name: 'queue',
        label: 'Hàng đợi',
        type: 'select',
        options: [
            { value: 'pending_payment', label: 'Chờ thanh toán' },
            { value: 'delivery', label: 'Chờ bàn giao' },
            { value: 'acceptance', label: 'Chờ xác nhận/hoàn trả' },
            { value: 'dispute', label: 'Đang tranh chấp' },
        ],
    },
    {
        name: 'age_minutes',
        label: 'Kẹt quá',
        type: 'select',
        options: [
            { value: 30, label: '30 phút' },
            { value: 120, label: '2 giờ' },
            { value: 1440, label: '24 giờ' },
        ],
    },
]

function MetricCard({ title, value, suffix, danger }) {
    return (
        <Card size="small">
            <Statistic
                title={title}
                value={value ?? 0}
                suffix={suffix}
                valueStyle={danger ? { color: '#cf1322' } : undefined}
            />
        </Card>
    )
}

export default function OperationsControlPage() {
    const navigate = useNavigate()
    const [tab, setTab] = useState('overview')
    const [overview, setOverview] = useState({})
    const [reconciliation, setReconciliation] = useState({})
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [holdParams, setHoldParams] = useState({
        state: 'active',
        per_page: 50,
    })
    const [queueParams, setQueueParams] = useState({
        age_minutes: 30,
        per_page: 50,
    })
    const [releaseRecord, setReleaseRecord] = useState(null)
    const [releaseNote, setReleaseNote] = useState('')
    const [timeline, setTimeline] = useState(null)
    const [checklist, setChecklist] = useState(null)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            if (tab === 'overview') {
                setOverview(unwrap(await service.overview()))
            } else if (tab === 'holds') {
                setRows(rowsOf(await service.holds(holdParams)))
            } else if (tab === 'queues') {
                setRows(rowsOf(await service.queues(queueParams)))
            } else if (tab === 'reconciliation') {
                setReconciliation(unwrap(await service.reconciliation()))
            }
        } catch (error) {
            message.error(error.message || 'Không thể tải dữ liệu vận hành.')
        } finally {
            setLoading(false)
        }
    }, [holdParams, queueParams, tab])

    useEffect(() => {
        load()
    }, [load])

    const holdColumns = useMemo(
        () => [
            {
                title: 'Sản phẩm',
                render: (_, row) => (
                    <BaseButton
                        type="link"
                        onClick={async () => {
                            setTimeline(
                                unwrap(
                                    await service.availabilityTimeline(
                                        row.product_id,
                                    ),
                                ),
                            )
                        }}
                    >
                        {row.product?.code || `#${row.product_id}`}
                    </BaseButton>
                ),
            },
            {
                title: 'Người giữ',
                render: (_, row) => row.customer?.name || 'Hệ thống',
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                render: (value, row) => {
                    const expired =
                        value === 'active' &&
                        row.hold_until &&
                        new Date(row.hold_until) <= new Date()
                    return (
                        <Tag color={expired ? 'red' : statusColor(value)}>
                            {expired
                                ? 'Đã quá hạn chưa nhả'
                                : statusLabel(value, valueLabel(value))}
                        </Tag>
                    )
                },
            },
            { title: 'Hết hạn', dataIndex: 'hold_until', width: 180 },
            {
                title: 'Phiên bản',
                render: (_, row) => row.product?.availability_version || '—',
            },
            {
                title: 'Nguồn',
                render: (_, row) =>
                    row.source_type
                        ? `${row.source_type.split('\\').pop()} #${row.source_id}`
                        : '—',
            },
            {
                title: 'Thao tác',
                fixed: 'right',
                width: 90,
                render: (_, row) =>
                    row.status === 'active' ? (
                        <BaseIconAction
                            danger
                            icon={<UnlockOutlined />}
                            label="Nhả hold thủ công"
                            onClick={() => {
                                setReleaseNote('')
                                setReleaseRecord(row)
                            }}
                        />
                    ) : null,
            },
        ],
        [],
    )

    const queueColumns = [
        { title: 'Mã', dataIndex: 'code', width: 150 },
        {
            title: 'Sản phẩm',
            render: (_, row) => row.product?.name || row.product?.code || '—',
        },
        {
            title: 'Người mua',
            render: (_, row) => row.buyer?.name || '—',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) => (
                <Tag color={statusColor(value)}>
                    {statusLabel(value, valueLabel(value))}
                </Tag>
            ),
        },
        { title: 'Cập nhật cuối', dataIndex: 'updated_at', width: 180 },
        {
            title: 'Chứng từ',
            render: (_, row) => (
                <BaseButton
                    type="link"
                    onClick={async () =>
                        setChecklist({
                            transaction: row,
                            rows: unwrap(
                                await service.documentChecklist(row.id),
                            ),
                        })
                    }
                >
                    Kiểm tra
                </BaseButton>
            ),
        },
        {
            title: 'Thao tác',
            fixed: 'right',
            render: (_, row) => (
                <BaseButton
                    type="link"
                    onClick={() => navigate(`/transactions/${row.id}`)}
                >
                    Mở hồ sơ
                </BaseButton>
            ),
        },
    ]

    const release = async () => {
        if (releaseNote.trim().length < 10) {
            message.warning('Ghi chú phải có ít nhất 10 ký tự.')
            return
        }
        try {
            await service.releaseHold(releaseRecord.id, {
                note: releaseNote.trim(),
                expected_version:
                    releaseRecord.product?.availability_version || undefined,
            })
            message.success('Đã nhả giữ chỗ.')
            setReleaseRecord(null)
            await load()
        } catch (error) {
            message.error(error.message || 'Không thể nhả giữ chỗ.')
        }
    }

    return (
        <div className="page">
            <BasePageHeader
                actions={
                    <BaseButton icon={<ReloadOutlined />} onClick={load}>
                        Tải lại
                    </BaseButton>
                }
                description="Theo dõi hold, giao dịch cần xử lý, chứng từ và đối soát dòng tiền."
                title="Điều hành Marketplace"
            />

            <Tabs
                activeKey={tab}
                onChange={(key) => {
                    setRows([])
                    setTab(key)
                }}
                items={[
                    { key: 'overview', label: 'Tổng quan' },
                    { key: 'holds', label: 'Hold' },
                    { key: 'queues', label: 'Cần xử lý' },
                    { key: 'reconciliation', label: 'Đối soát' },
                ]}
            />

            {tab === 'overview' ? (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <Alert
                        showIcon
                        type={
                            overview.holds?.expired_unreleased
                                ? 'warning'
                                : 'success'
                        }
                        message="Tình trạng vận hành"
                        description={`Có ${overview.holds?.expired_unreleased || 0} hold quá hạn chưa được nhả và ${overview.queues?.dispute || 0} hồ sơ tranh chấp đang mở.`}
                    />
                    <div className="base-statistics-grid">
                        <MetricCard
                            title="Hold đang hoạt động"
                            value={overview.holds?.active}
                        />
                        <MetricCard
                            title="Hold sắp hết hạn"
                            value={overview.holds?.expiring_soon}
                        />
                        <MetricCard
                            danger
                            title="Hold quá hạn"
                            value={overview.holds?.expired_unreleased}
                        />
                        <MetricCard
                            title="Đã nhả hôm nay"
                            value={overview.holds?.released_today}
                        />
                        <MetricCard
                            title="Chờ thanh toán"
                            value={overview.queues?.pending_payment}
                        />
                        <MetricCard
                            title="Chờ bàn giao"
                            value={overview.queues?.delivery}
                        />
                        <MetricCard
                            title="Chờ xác nhận"
                            value={overview.queues?.acceptance}
                        />
                        <MetricCard
                            danger
                            title="Tranh chấp"
                            value={overview.queues?.dispute}
                        />
                    </div>
                    <Card title="Việc quá hạn cần xử lý">
                        <div className="base-statistics-grid">
                            {Object.entries(overview.sla || {}).map(
                                ([key, item]) => (
                                    <MetricCard
                                        key={key}
                                        danger={item.breached > 0}
                                        title={`${valueLabel(key)} quá hạn`}
                                        value={item.breached}
                                        suffix={`/ ${item.total}`}
                                    />
                                ),
                            )}
                        </div>
                    </Card>
                    <Card title="Checkout lặp">
                        <Space size="large" wrap>
                            <Statistic
                                prefix={<SyncOutlined />}
                                title="Phát lại an toàn"
                                value={
                                    overview.idempotency
                                        ?.duplicate_checkout_replays || 0
                                }
                            />
                            <Statistic
                                prefix={<WarningOutlined />}
                                title="Xung đột idempotency"
                                value={
                                    overview.idempotency
                                        ?.idempotency_conflicts || 0
                                }
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Space>
                    </Card>
                </Space>
            ) : null}

            {tab === 'holds' ? (
                <>
                    <BaseFilter
                        fields={holdFilters}
                        loading={loading}
                        onReset={() =>
                            setHoldParams({ state: 'active', per_page: 50 })
                        }
                        onSearch={(values) =>
                            setHoldParams({ ...values, per_page: 50 })
                        }
                        values={holdParams}
                    />
                    <BaseTable
                        columns={holdColumns}
                        dataSource={rows}
                        loading={loading}
                        pagination={false}
                        rowKey="id"
                    />
                </>
            ) : null}

            {tab === 'queues' ? (
                <>
                    <BaseFilter
                        fields={queueFilters}
                        loading={loading}
                        onReset={() =>
                            setQueueParams({ age_minutes: 30, per_page: 50 })
                        }
                        onSearch={(values) =>
                            setQueueParams({ ...values, per_page: 50 })
                        }
                        values={queueParams}
                    />
                    <BaseTable
                        columns={queueColumns}
                        dataSource={rows}
                        loading={loading}
                        pagination={false}
                        rowKey="id"
                    />
                </>
            ) : null}

            {tab === 'reconciliation' ? (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <div className="base-statistics-grid">
                        <MetricCard
                            title="Thanh toán chờ duyệt"
                            value={reconciliation.payments?.submitted_count}
                        />
                        <MetricCard
                            danger
                            title="Thanh toán quá hạn"
                            value={reconciliation.payments?.overdue_count}
                        />
                        <Card size="small">
                            <Statistic
                                title="Tiền ví khả dụng"
                                valueRender={() => (
                                    <Money
                                        value={reconciliation.wallet?.available}
                                    />
                                )}
                                value={0}
                            />
                        </Card>
                        <Card size="small">
                            <Statistic
                                title="Tiền đang giữ"
                                valueRender={() => (
                                    <Money
                                        value={reconciliation.wallet?.held}
                                    />
                                )}
                                value={0}
                            />
                        </Card>
                        <Card size="small">
                            <Statistic
                                title="Payout đang chờ"
                                valueRender={() => (
                                    <Money
                                        value={
                                            reconciliation.payouts?.submitted
                                        }
                                    />
                                )}
                                value={0}
                            />
                        </Card>
                        <Card size="small">
                            <Statistic
                                title="Đã hoàn"
                                valueRender={() => (
                                    <Money
                                        value={reconciliation.refunds?.amount}
                                    />
                                )}
                                value={0}
                            />
                        </Card>
                    </div>
                    <Alert
                        showIcon
                        type={
                            Object.values(reconciliation.imbalances || {}).some(
                                Boolean,
                            )
                                ? 'error'
                                : 'success'
                        }
                        message="Kiểm tra mất cân đối"
                        description={`Ví âm: ${reconciliation.imbalances?.wallet_negative || 0}; giao dịch trả thừa: ${reconciliation.imbalances?.transaction_overpaid || 0}; giải ngân vượt escrow: ${reconciliation.imbalances?.release_exceeds_escrow || 0}.`}
                    />
                </Space>
            ) : null}

            <BaseModal
                open={Boolean(releaseRecord)}
                title="Nhả giữ chỗ thủ công"
                submitText="Xác nhận nhả"
                onCancel={() => setReleaseRecord(null)}
                onSubmit={release}
            >
                <Alert
                    showIcon
                    type="warning"
                    message="Thao tác ảnh hưởng trực tiếp đến khả năng giao dịch sản phẩm"
                    description="Chỉ nhả khi đã xác minh giao dịch nguồn không còn quyền giữ sản phẩm. Ghi chú sẽ được lưu vào timeline và audit log."
                />
                <Input.TextArea
                    rows={5}
                    value={releaseNote}
                    onChange={(event) => setReleaseNote(event.target.value)}
                    placeholder="Nhập lý do và bằng chứng xác minh (bắt buộc, tối thiểu 10 ký tự)"
                />
            </BaseModal>

            <BaseModal
                open={Boolean(timeline)}
                title="Availability timeline"
                footer={null}
                onCancel={() => setTimeline(null)}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert
                        showIcon
                        icon={<ClockCircleOutlined />}
                        message={`${timeline?.product?.code || ''} · ${statusLabel(timeline?.product?.availability_status, valueLabel(timeline?.product?.availability_status))} · phiên bản ${timeline?.product?.availability_version || ''}`}
                    />
                    <BaseTable
                        columns={[
                            { title: 'Thời điểm', dataIndex: 'created_at' },
                            {
                                title: 'Từ',
                                dataIndex: 'from_status',
                                render: (value) => (
                                    <Tag color={statusColor(value)}>
                                        {statusLabel(value, valueLabel(value))}
                                    </Tag>
                                ),
                            },
                            {
                                title: 'Sang',
                                dataIndex: 'to_status',
                                render: (value) => (
                                    <Tag color={statusColor(value)}>
                                        {statusLabel(value, valueLabel(value))}
                                    </Tag>
                                ),
                            },
                            { title: 'Hold đến', dataIndex: 'hold_until' },
                            { title: 'Ghi chú', dataIndex: 'note' },
                        ]}
                        dataSource={timeline?.timeline || []}
                        pagination={false}
                        rowKey="id"
                    />
                </Space>
            </BaseModal>

            <BaseModal
                open={Boolean(checklist)}
                title={`Checklist chứng từ · ${checklist?.transaction?.code || ''}`}
                footer={null}
                onCancel={() => setChecklist(null)}
            >
                <BaseTable
                    columns={[
                        {
                            title: 'Loại chứng từ',
                            dataIndex: 'document_type',
                            render: (value) => valueLabel(value),
                        },
                        {
                            title: 'Đã tạo',
                            dataIndex: 'generated',
                            render: (value) => (
                                <Tag color={value ? 'green' : 'red'}>
                                    {value ? 'Có' : 'Thiếu'}
                                </Tag>
                            ),
                        },
                        {
                            title: 'Đã chấp thuận',
                            dataIndex: 'accepted',
                            render: (value) =>
                                value ? (
                                    <SafetyCertificateOutlined />
                                ) : (
                                    <FileDoneOutlined />
                                ),
                        },
                    ]}
                    dataSource={checklist?.rows || []}
                    pagination={false}
                    rowKey="document_type"
                />
            </BaseModal>
        </div>
    )
}
