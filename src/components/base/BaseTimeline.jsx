import {
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    forwardRef,
} from 'react'
import { ClockCircleOutlined } from '@ant-design/icons'
import { Empty, Pagination, Spin, Typography } from 'antd'

import TimelineChangeItem from '@/components/timeline/TimelineChangeItem'
import { renderUsers } from '@/components/base/renderers'
import { useTimeline } from '@/hooks/useTimeline'
import { buildTimelineGroups } from '@/utils/timeline'
import { ACTIVITY_TYPE_META } from '@/modules/shared/enums/activity_type.enum'
import './BaseTimeline.css'

const BaseTimeline = forwardRef(function BaseTimeline(
    {
        entityId,
        service,
        activeTab,
        currentTab = 'timeline',
        method = 'getTimeline',
        emptyText = 'Không có dữ liệu',
        timelineSchema = null,
        params = {},
        header = null,
        refreshKey = 0,
    },
    ref,
) {
    const { timeline, loading, fetch, pagination, meta } = useTimeline(
        entityId,
        service,
        {
            method,
            immediate: false,
            params,
        },
    )
    const reload = useCallback(
        () => fetch(1, pagination.perPage),
        [fetch, pagination.perPage],
    )
    useImperativeHandle(ref, () => ({ reload }), [reload])
    useEffect(() => {
        if ((activeTab === undefined || activeTab === currentTab) && entityId)
            reload()
    }, [activeTab, currentTab, entityId, refreshKey, reload])
    const groups = useMemo(
        () => buildTimelineGroups(timeline, timelineSchema),
        [timeline, timelineSchema],
    )
    const headerNode =
        typeof header === 'function'
            ? header({ meta, loading, reload })
            : header

    return (
        <Spin spinning={loading && Boolean(groups.length)}>
            <div className="base-timeline">
                {headerNode}
                {loading && !timeline.length ? <Spin /> : null}
                {!loading && !groups.length ? (
                    <Empty description={emptyText} />
                ) : null}
                {groups.length ? (
                    <div className="base-timeline__rail">
                        {groups.map((group) => (
                            <section
                                key={group.date}
                                className="base-timeline__group"
                            >
                                <h4 className="base-timeline__date">
                                    {group.label}
                                </h4>
                                <div className="base-timeline__items">
                                    {group.items.map((item) => {
                                        const activityMeta =
                                            timelineSchema?.activity?.[
                                                item.activitySubtype
                                            ] ||
                                            timelineSchema?.activity?.[
                                                item.activityType
                                            ] ||
                                            ACTIVITY_TYPE_META[
                                                item.activityType
                                            ] ||
                                            {}
                                        const Icon = activityMeta.icon
                                        const color =
                                            activityMeta.color || '#8b5cf6'
                                        return (
                                            <article
                                                key={
                                                    item.timelineKey || item.id
                                                }
                                                className="base-timeline__item"
                                            >
                                                <span
                                                    className="base-timeline__icon"
                                                    style={{
                                                        backgroundColor: color,
                                                    }}
                                                >
                                                    {Icon ? <Icon /> : null}
                                                </span>
                                                <div
                                                    className="base-timeline__card"
                                                    style={{
                                                        borderLeftColor: color,
                                                    }}
                                                >
                                                    <div className="base-timeline__header">
                                                        <Typography.Text strong>
                                                            {item.title}
                                                        </Typography.Text>
                                                    </div>
                                                    {item.changes.length ? (
                                                        <div className="base-timeline__changes">
                                                            {item.changes.map(
                                                                (
                                                                    change,
                                                                    index,
                                                                ) => (
                                                                    <TimelineChangeItem
                                                                        key={`${change.field}-${index}`}
                                                                        change={
                                                                            change
                                                                        }
                                                                        activityType={
                                                                            item.activityType
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </div>
                                                    ) : null}
                                                    {item.content ? (
                                                        <div className="base-timeline__content">
                                                            {item.content}
                                                        </div>
                                                    ) : null}
                                                    <div className="base-timeline__footer">
                                                        {renderUsers(
                                                            item.actor,
                                                        )}
                                                        <span>
                                                            <ClockCircleOutlined />{' '}
                                                            {item.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        )
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : null}
                {pagination.total > pagination.perPage ? (
                    <div className="base-timeline__pagination">
                        <Pagination
                            current={pagination.page}
                            pageSize={pagination.perPage}
                            total={pagination.total}
                            onChange={fetch}
                            showSizeChanger
                        />
                    </div>
                ) : null}
            </div>
        </Spin>
    )
})

export default BaseTimeline
