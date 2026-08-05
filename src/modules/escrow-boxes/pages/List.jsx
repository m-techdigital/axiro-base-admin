import { EyeOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { useNavigate } from 'react-router'

import { BaseFilter, BaseIconAction, BaseListView, BasePageHeader, Money } from '@/components/base'
import { useBaseFilters, useList } from '@/hooks'

import service from '../service'

const statusLabels = {
    awaiting_counterparty: 'Chờ Bên B', terms_pending: 'Đang thỏa thuận', admin_review: 'Chờ thẩm định', changes_requested: 'Cần bổ sung',
    payment_pending: 'Chờ thanh toán', handover_in_progress: 'Đang bàn giao', inspection: 'Đang kiểm tra', disputed: 'Tranh chấp', settled: 'Hoàn tất', rejected: 'Từ chối', cancelled: 'Đã hủy',
}
const filters = [
    { name: 'keyword', label: 'Mã box', type: 'search' },
    { name: 'status', label: 'Trạng thái', type: 'select', options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })) },
    { name: 'risk_level', label: 'Rủi ro', type: 'select', options: ['low','medium','high','blocked'].map((value) => ({ value, label: value })) },
]

export default function EscrowBoxList() {
    const navigate = useNavigate()
    const list = useList(service, { page: 1, per_page: 20 })
    const query = useBaseFilters({ defaultParams: { page: 1, per_page: 20 }, onSearch: list.setParams, onReset: list.setParams })
    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Loại', dataIndex: 'deal_type', render: (value) => value === 'exchange_with_topup' ? 'Trao đổi có bù' : 'Trao đổi ngang' },
        { title: 'Tiền bù', dataIndex: 'topup_amount', render: (value) => <Money value={value} /> },
        { title: 'Phí', dataIndex: 'final_fee', render: (value) => <Money value={value} /> },
        { title: 'Rủi ro', dataIndex: 'risk_level', render: (value) => <Tag>{value || 'Chưa đánh giá'}</Tag> },
        { title: 'Trạng thái', dataIndex: 'status', render: (value) => <Tag>{statusLabels[value] || value}</Tag> },
        { title: 'Thao tác', key: 'actions', render: (_, record) => <BaseIconAction icon={<EyeOutlined />} label="Xem box" onClick={() => navigate(`/escrow-boxes/${record.id}`)} /> },
    ]
    return <BaseListView columns={columns} data={list.data} filters={<BaseFilter fields={filters} values={query.filters} loading={list.loading} onSearch={query.search} onReset={query.reset} />} header={<BasePageHeader title="Box giao dịch trung gian" description="Thẩm định điều khoản, phí, rủi ro và điều phối bàn giao với danh tính nội bộ được bảo vệ." />} loading={list.loading} onChange={(pagination) => query.paginate(pagination.current, pagination.pageSize)} pagination={{ total: list.meta.pagination?.total, current: list.meta.pagination?.current_page, pageSize: list.meta.pagination?.per_page }} />
}
