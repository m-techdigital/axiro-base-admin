import { Empty } from 'antd'

export default function BaseTableEmptyState() {
    return (
        <Empty
            description="Chưa có dữ liệu"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
    )
}
