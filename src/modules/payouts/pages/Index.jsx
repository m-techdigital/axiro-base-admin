import { BasePageHeader, BaseTable } from '@/components/base'
import { Card, Tabs } from 'antd'
import { lazy, Suspense } from 'react'
import { payoutTabs } from '../config/options'
import { usePayoutCenter } from '../hooks/usePayoutCenter'

const PayoutDecisionModal = lazy(
    () => import('../components/PayoutDecisionModal'),
)

export default function PayoutCenter() {
    const center = usePayoutCenter()

    return (
        <div className="page">
            <BasePageHeader title="Xác minh và chi trả người bán" />
            <Card>
                <Tabs
                    activeKey={center.active}
                    onChange={center.setActive}
                    items={payoutTabs}
                />
                <BaseTable
                    rowKey="id"
                    loading={center.loading}
                    dataSource={center.rows}
                    columns={center.columns}
                    scroll={{ x: 900 }}
                />
            </Card>
            {center.selected ? (
                <Suspense fallback={null}>
                    <PayoutDecisionModal
                        active={center.active}
                        selected={center.selected}
                        note={center.note}
                        reference={center.reference}
                        onNoteChange={center.setNote}
                        onReferenceChange={center.setReference}
                        onAct={center.act}
                        onClose={center.close}
                    />
                </Suspense>
            ) : null}
        </div>
    )
}
