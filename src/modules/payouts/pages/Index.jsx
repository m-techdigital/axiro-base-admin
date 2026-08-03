import { BaseTable } from '@/components/base'
import { Card, Tabs } from 'antd'
import PageHeader from '@/components/base/PageHeader'
import PayoutDecisionModal from '../components/PayoutDecisionModal'
import { payoutTabs } from '../config/options'
import { usePayoutCenter } from '../hooks/usePayoutCenter'

export default function PayoutCenter() {
    const center = usePayoutCenter()

    return (
        <div className="page">
            <PageHeader title="Xác minh và chi trả người bán" />
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
        </div>
    )
}
