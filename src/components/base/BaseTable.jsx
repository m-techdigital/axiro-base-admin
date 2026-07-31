import { Empty, Table } from 'antd'

export default function BaseTable({
    data,
    dataSource,
    columns,
    loading,
    pagination,
    onChange,
    rowKey = 'id',
    scroll,
    className = '',
    locale,
    ...props
}) {
    return (
        <div className={`base-table app-table-scroll ${className}`.trim()}>
            <Table
                columns={columns}
                dataSource={dataSource ?? data ?? []}
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
                pagination={pagination}
                rowKey={rowKey}
                scroll={scroll || { x: 'max-content' }}
                {...props}
            />
        </div>
    )
}
