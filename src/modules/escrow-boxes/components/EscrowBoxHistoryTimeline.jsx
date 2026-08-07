import { BaseTimeline } from '@/components/base'
import { escrowBoxTimelineSchema } from '../timeline'
import service from '../service'

export default function EscrowBoxHistoryTimeline({
    boxId,
    loading = false,
    refreshKey = 0,
}) {
    return (
        <BaseTimeline
            entityId={boxId}
            service={service}
            method="getTimeline"
            timelineSchema={escrowBoxTimelineSchema}
            emptyText="Chưa có hoạt động của Box."
            refreshKey={refreshKey}
            header={loading ? null : undefined}
        />
    )
}
