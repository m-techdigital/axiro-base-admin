import { Card } from 'antd'

import BaseAsyncState from './BaseAsyncState'
import BasePageHeader from './BasePageHeader'
import BaseTable from './BaseTable'

export default function BaseListView({
    actions,
    children,
    className = '',
    description,
    emptyText = 'Chưa có dữ liệu',
    error,
    filters,
    header,
    headerItems,
    loading,
    onReload,
    onRetry,
    showReload = false,
    statistics,
    tableCardProps,
    title,
    ...tableProps
}) {
    const rows = tableProps.dataSource ?? tableProps.data ?? []
    const resolvedHeader =
        header ||
        (title ? (
            <BasePageHeader
                actions={actions}
                description={description}
                items={headerItems}
                onReload={onReload || onRetry}
                reloadLoading={loading}
                showReload={showReload}
                title={title}
            />
        ) : null)

    return (
        <section className={`base-list-view ${className}`.trim()}>
            {resolvedHeader}
            {statistics}
            {filters ? (
                <Card className="base-list-view__filters" size="small">
                    {filters}
                </Card>
            ) : null}
            <Card className="base-list-view__card" {...tableCardProps}>
                {children || (
                    <BaseAsyncState
                        empty={!loading && !error && rows.length === 0}
                        emptyText={emptyText}
                        error={error}
                        loading={loading}
                        onRetry={onRetry}
                    >
                        <BaseTable {...tableProps} loading={false} />
                    </BaseAsyncState>
                )}
            </Card>
        </section>
    )
}
