import {
    BaseButton,
    BaseFilter,
    BaseListView,
    BasePageHeader,
} from '@/components/base'
import { lazy, Suspense } from 'react'

const NotificationDetailDrawer = lazy(
    () => import('../components/NotificationDetailDrawer'),
)
import { notificationFilterFields } from '../config/filters'
import { useNotificationCenter } from '../hooks/useNotificationCenter'
import service from '../service'

export default function NotificationList() {
    const center = useNotificationCenter()

    return (
        <>
            <BaseListView
                columns={center.columns}
                data={center.list.data}
                filters={
                    <BaseFilter
                        fields={notificationFilterFields}
                        loading={center.list.loading}
                        onReset={center.filters.reset}
                        onSearch={center.filters.search}
                        values={center.filters.filters}
                    />
                }
                header={
                    <BasePageHeader
                        title="Trung tâm thông báo"
                        description="Lọc thông báo theo giao dịch, khách hàng, loại và trạng thái đọc."
                        actions={
                            <BaseButton
                                onClick={async () => {
                                    await service.readAll()
                                    await center.list.reload()
                                }}
                            >
                                Đánh dấu tất cả đã đọc
                            </BaseButton>
                        }
                    />
                }
                loading={center.list.loading}
                onChange={(pagination) =>
                    center.filters.paginate(
                        pagination.current,
                        pagination.pageSize,
                    )
                }
                pagination={{
                    total: center.list.meta.pagination?.total,
                    current: center.list.meta.pagination?.current_page,
                    pageSize: center.list.meta.pagination?.per_page,
                    showSizeChanger: true,
                }}
            />
            {center.detail || center.detailLoading ? (
                <Suspense fallback={null}>
                    <NotificationDetailDrawer
                        detail={center.detail}
                        loading={center.detailLoading}
                        handlingNote={center.handlingNote}
                        onHandlingNoteChange={center.setHandlingNote}
                        onHandle={center.handle}
                        onClose={() => center.setDetail(null)}
                        onNavigate={center.navigate}
                    />
                </Suspense>
            ) : null}
        </>
    )
}
