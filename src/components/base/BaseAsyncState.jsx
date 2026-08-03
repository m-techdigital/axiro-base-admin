import { Alert, Empty, Spin } from 'antd'

export default function BaseAsyncState({
    loading = false,
    error,
    empty = false,
    emptyText = 'Chưa có dữ liệu',
    onRetry,
    children,
}) {
    if (loading) {
        return (
            <div className="base-async-state base-async-state--loading">
                <Spin />
            </div>
        )
    }

    if (error) {
        return (
            <Alert
                action={
                    onRetry ? (
                        <button
                            className="base-async-state__retry"
                            onClick={onRetry}
                            type="button"
                        >
                            Thử lại
                        </button>
                    ) : null
                }
                description={error?.message || String(error)}
                title="Không thể tải dữ liệu"
                showIcon
                type="error"
            />
        )
    }

    if (empty) {
        return (
            <Empty
                description={emptyText}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        )
    }

    return children
}
