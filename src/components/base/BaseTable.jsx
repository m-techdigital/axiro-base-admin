import { Empty, Table } from 'antd'
import { useMemo } from 'react'

function stableRecordKey(record) {
    const source = Object.entries(record || {})
        .filter(([, value]) =>
            ['string', 'number', 'boolean'].includes(typeof value),
        )
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}:${String(value)}`)
        .join('|')
    let hash = 5381
    for (const character of source || 'empty-record') {
        hash = (hash * 33) ^ character.charCodeAt(0)
    }
    return `record-${(hash >>> 0).toString(36)}`
}

function normalizePagination(pagination, meta, onPaginationChange) {
    if (pagination === false) return false
    const source = pagination || meta?.pagination || meta || {}
    return {
        current: source.current ?? source.current_page ?? 1,
        pageSize: source.pageSize ?? source.per_page ?? 15,
        total: source.total ?? 0,
        hideOnSinglePage: false,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} bản ghi`,
        onChange: onPaginationChange,
        ...pagination,
    }
}

export default function BaseTable({
    className = '',
    columns,
    data,
    dataSource,
    loading,
    locale,
    meta,
    onChange,
    onPaginationChange,
    pagination,
    rowKey = 'id',
    scroll,
    size = 'middle',
    sticky = false,
    ...props
}) {
    const resolvedData = dataSource ?? data ?? []
    const resolvedRowKey = useMemo(() => {
        if (typeof rowKey === 'function') return rowKey
        return (record) => {
            const candidate =
                record?.[rowKey] ??
                record?.id ??
                record?.uuid ??
                record?.code ??
                record?.key
            return candidate !== undefined &&
                candidate !== null &&
                candidate !== ''
                ? String(candidate)
                : stableRecordKey(record)
        }
    }, [rowKey])

    const normalizedColumns = (columns || []).map((column) => {
        if (column.key === 'actions' || column.dataIndex === 'actions') {
            return {
                align: column.align || 'center',
                width: column.width ?? 1,
                minWidth: column.minWidth ?? 1,
                onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
                ...column,
                className:
                    `base-table__actions ${column.className || ''}`.trim(),
            }
        }
        return column
    })

    return (
        <div className={`base-table app-table-scroll ${className}`.trim()}>
            <Table
                columns={normalizedColumns}
                dataSource={resolvedData}
                loading={loading}
                locale={{
                    emptyText: (
                        <Empty
                            description="Chưa có dữ liệu"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ),
                    ...locale,
                }}
                onChange={onChange}
                pagination={normalizePagination(
                    pagination,
                    meta,
                    onPaginationChange,
                )}
                rowKey={resolvedRowKey}
                scroll={scroll || { x: 'max-content' }}
                size={size}
                sticky={sticky}
                {...props}
            />
        </div>
    )
}
