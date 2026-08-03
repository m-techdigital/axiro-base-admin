import {
    ClockCircleOutlined,
    FileDoneOutlined,
    ReloadOutlined,
    SafetyCertificateOutlined,
    SyncOutlined,
    WarningOutlined,
} from '@ant-design/icons'
import {
    Alert,
    Card,
    Input,
    Progress,
    Space,
    Statistic,
    Tabs,
    Tag,
    message,
} from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    BaseButton,
    BaseFilter,
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

import FilterPresetBar from '../components/FilterPresetBar'
import {
    createHoldColumns,
    createQueueColumns,
    MetricCard,
} from '../components/operationsColumns'
import { holdFilters, queueFilters, settlementFilters } from '../config/filters'
import service from '../service'

const unwrap = (response) => response?.data?.data || response?.data || {}
const rowsOf = (response) => {
    const payload = unwrap(response)
    return Array.isArray(payload) ? payload : payload?.data || []
}

export default function OperationsControlPage() {
    const navigate = useNavigate()
    const [tab, setTab] = useState('overview')
    const [overview, setOverview] = useState({})
    const [today, setToday] = useState({})
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
    const [settlementParams, setSettlementParams] = useState({})
    const [exportRequest, setExportRequest] = useState(null)

    useEffect(() => {
        if (
            !exportRequest?.id ||
            !['pending', 'processing'].includes(exportRequest.status)
        ) {
            return undefined
        }

        const timer = window.setInterval(async () => {
            try {
                const response = await service.rentalSettlementExportStatus(
                    exportRequest.id,
                )
                const current = unwrap(response)
                setExportRequest(current)

                if (current.status === 'completed') {
                    message.success(
                        `Đã tạo tệp xuất ${current.row_count || 0} dòng.`,
                    )
                } else if (current.status === 'failed') {
                    message.error(
                        current.error_message || 'Tạo tệp xuất thất bại.',
                    )
                }
            } catch (error) {
                message.error(
                    error.message || 'Không thể kiểm tra tiến độ xuất dữ liệu.',
                )
            }
        }, 3000)

        return () => window.clearInterval(timer)
    }, [exportRequest?.id, exportRequest?.status])

    const load = useCallback(async () => {
        setLoading(true)
        try {
            if (tab === 'overview') {
                const [overviewResponse, todayResponse] = await Promise.all([
                    service.overview(),
                    service.today(),
                ])
                setOverview(unwrap(overviewResponse))
                setToday(unwrap(todayResponse))
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
        () =>
            createHoldColumns({
                loadTimeline: async (row) => {
                    setTimeline(
                        unwrap(
                            await service.availabilityTimeline(row.product_id),
                        ),
                    )
                },
                openRelease: (row) => {
                    setReleaseNote('')
                    setReleaseRecord(row)
                },
            }),
        [],
    )

    const queueColumns = useMemo(
        () =>
            createQueueColumns({
                navigate,
                inspectDocuments: async (row) =>
                    setChecklist({
                        transaction: row,
                        rows: unwrap(await service.documentChecklist(row.id)),
                    }),
            }),
        [navigate],
    )

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
                        <MetricCard
                            danger
                            title="Thuê quá hạn"
                            value={overview.queues?.overdue_rental}
                        />
                        <MetricCard
                            title="Chờ hoàn trả"
                            value={overview.queues?.pending_return}
                        />
                        <MetricCard
                            title="Chờ quyết toán cọc"
                            value={overview.queues?.deposit_deduction_review}
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
                    <FilterPresetBar
                        storageKey="operations.queue-presets"
                        values={queueParams}
                        onApply={setQueueParams}
                    />
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
                    <FilterPresetBar
                        storageKey="operations.settlement-presets"
                        values={settlementParams}
                        onApply={setSettlementParams}
                    />
                    <BaseFilter
                        fields={settlementFilters}
                        loading={loading}
                        onReset={() => setSettlementParams({})}
                        onSearch={setSettlementParams}
                        values={settlementParams}
                    />
                    <BaseButton
                        onClick={async () => {
                            try {
                                const response =
                                    await service.requestRentalSettlementExport(
                                        settlementParams,
                                    )
                                setExportRequest(unwrap(response))
                                message.success(
                                    'Đã đưa yêu cầu xuất dữ liệu vào hàng đợi.',
                                )
                            } catch (error) {
                                message.error(
                                    error.message ||
                                        'Không thể xuất quyết toán giao dịch thuê.',
                                )
                            }
                        }}
                    >
                        Xuất quyết toán giao dịch thuê
                    </BaseButton>
                    {exportRequest ? (
                        <Card size="small" title="Tiến độ tệp xuất">
                            <Space
                                direction="vertical"
                                style={{ width: '100%' }}
                            >
                                <Progress
                                    percent={
                                        exportRequest.status === 'completed'
                                            ? 100
                                            : exportRequest.status ===
                                                'processing'
                                              ? 60
                                              : exportRequest.status ===
                                                  'failed'
                                                ? 100
                                                : 20
                                    }
                                    status={
                                        exportRequest.status === 'failed'
                                            ? 'exception'
                                            : undefined
                                    }
                                />
                                <span>
                                    Trạng thái:{' '}
                                    {valueLabel(exportRequest.status)}
                                    {exportRequest.row_count
                                        ? ` · ${exportRequest.row_count} dòng`
                                        : ''}
                                </span>
                                {exportRequest.status === 'completed' ? (
                                    <BaseButton
                                        onClick={() =>
                                            service.downloadRentalSettlementExport(
                                                exportRequest.id,
                                            )
                                        }
                                    >
                                        Tải tệp CSV
                                    </BaseButton>
                                ) : null}
                            </Space>
                        </Card>
                    ) : null}
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
