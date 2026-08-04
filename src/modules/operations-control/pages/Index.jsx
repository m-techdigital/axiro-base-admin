import { ReloadOutlined } from '@ant-design/icons'
import { Tabs, message } from 'antd'
import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { BaseButton, BasePageHeader } from '@/components/base'

import {
    createHoldColumns,
    createQueueColumns,
} from '../components/operationsColumns'
import useSettlementExport from '../hooks/useSettlementExport'
import service from '../service'

const OperationsModals = lazy(() => import('../components/OperationsModals'))
const HoldsTab = lazy(() => import('../components/tabs/HoldsTab'))
const OverviewTab = lazy(() => import('../components/tabs/OverviewTab'))
const QueuesTab = lazy(() => import('../components/tabs/QueuesTab'))
const ReconciliationTab = lazy(
    () => import('../components/tabs/ReconciliationTab'),
)

const unwrap = (response) => response?.data?.data || response?.data || {}
const rowsOf = (response) => {
    const payload = unwrap(response)
    return Array.isArray(payload) ? payload : payload?.data || []
}

export default function OperationsControlPage() {
    const navigate = useNavigate()
    const exportState = useSettlementExport()
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
    const [settlementParams, setSettlementParams] = useState({})
    const [releaseRecord, setReleaseRecord] = useState(null)
    const [releaseNote, setReleaseNote] = useState('')
    const [timeline, setTimeline] = useState(null)
    const [checklist, setChecklist] = useState(null)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            if (tab === 'overview') {
                const [overviewResponse] = await Promise.all([
                    service.overview(),
                    service.today(),
                ])
                setOverview(unwrap(overviewResponse))
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
                loadTimeline: async (row) =>
                    setTimeline(
                        unwrap(
                            await service.availabilityTimeline(row.product_id),
                        ),
                    ),
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

    const hasOpenModal = Boolean(releaseRecord || timeline || checklist)

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
                    { key: 'holds', label: 'Giữ chỗ' },
                    { key: 'queues', label: 'Cần xử lý' },
                    { key: 'reconciliation', label: 'Đối soát' },
                ]}
            />
            <Suspense fallback={null}>
                {tab === 'overview' ? (
                    <OverviewTab overview={overview} />
                ) : null}
                {tab === 'holds' ? (
                    <HoldsTab
                        columns={holdColumns}
                        loading={loading}
                        params={holdParams}
                        rows={rows}
                        onParamsChange={setHoldParams}
                    />
                ) : null}
                {tab === 'queues' ? (
                    <QueuesTab
                        columns={queueColumns}
                        loading={loading}
                        params={queueParams}
                        rows={rows}
                        onParamsChange={setQueueParams}
                    />
                ) : null}
                {tab === 'reconciliation' ? (
                    <ReconciliationTab
                        exportState={exportState}
                        loading={loading}
                        params={settlementParams}
                        reconciliation={reconciliation}
                        onParamsChange={setSettlementParams}
                    />
                ) : null}
            </Suspense>
            {hasOpenModal ? (
                <Suspense fallback={null}>
                    <OperationsModals
                        checklist={checklist}
                        releaseNote={releaseNote}
                        releaseRecord={releaseRecord}
                        timeline={timeline}
                        onChecklistClose={() => setChecklist(null)}
                        onRelease={release}
                        onReleaseClose={() => setReleaseRecord(null)}
                        onReleaseNoteChange={setReleaseNote}
                        onTimelineClose={() => setTimeline(null)}
                    />
                </Suspense>
            ) : null}
        </div>
    )
}
