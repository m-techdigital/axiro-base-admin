import { CaretRightOutlined } from '@ant-design/icons'

const display = (value) => {
    if (value === null || value === undefined || value === '') return '—'
    if (typeof value === 'boolean') return value ? 'Có' : 'Không'
    if (Array.isArray(value)) return value.map(display).join(', ')
    if (typeof value === 'object') {
        return value.label || value.name || value.title || value.code || '—'
    }
    return String(value)
}

export default function TimelineChangeItem({ change, activityType }) {
    if (activityType === 'created') {
        return (
            <div className="base-timeline-change">
                <span className="base-timeline-change__label">
                    • {change.label}:
                </span>
                <strong>{display(change.new)}</strong>
            </div>
        )
    }

    return (
        <div className="base-timeline-change">
            <span className="base-timeline-change__label">
                • {change.label}:
            </span>
            {JSON.stringify(change.old) === JSON.stringify(change.new) ? (
                <strong>{display(change.new)}</strong>
            ) : (
                <>
                    <span className="base-timeline-change__old">
                        {display(change.old)}
                    </span>
                    <CaretRightOutlined className="base-timeline-change__arrow" />
                    <strong>{display(change.new)}</strong>
                </>
            )}
        </div>
    )
}
