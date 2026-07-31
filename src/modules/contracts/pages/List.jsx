import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Tag, message } from 'antd'
import { useNavigate } from 'react-router-dom'

import {
    BaseActionGroup,
    BaseButton,
    BaseDeleteButton,
    BaseFilter,
    BaseListView,
    BasePageHeader,
    Money,
} from '@/components/base'
import { useBaseFilters, useList } from '@/hooks'

import service from '../service'

const filterFields = [
    {
        name: 'keyword',
        label: 'Từ khóa',
        type: 'search',
        placeholder: 'Tìm theo mã hoặc tiêu đề hợp đồng',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { value: 'draft', label: 'Bản nháp' },
            { value: 'active', label: 'Đang hiệu lực' },
            { value: 'completed', label: 'Đã hoàn tất' },
            { value: 'cancelled', label: 'Đã hủy' },
        ],
    },
]

export default function ContractList() {
    const navigate = useNavigate()
    const list = useList(service, { page: 1, per_page: 20 })
    const filters = useBaseFilters({
        defaultParams: { page: 1, per_page: 20 },
        onSearch: list.setParams,
        onReset: list.setParams,
    })

    const remove = async (record) => {
        try {
            await service.delete(record.id)
            message.success('Đã xóa hợp đồng')
            await list.reload()
        } catch (error) {
            message.error(error.message)
        }
    }

    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tiêu đề', dataIndex: 'title' },
        {
            title: 'Giao dịch',
            render: (_, record) => record.transaction?.code || '—',
        },
        {
            title: 'Giá trị',
            dataIndex: 'contract_value',
            render: (value) => <Money value={value} />,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) => <Tag>{value}</Tag>,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            fixed: 'right',
            render: (_, record) => (
                <BaseActionGroup>
                    <BaseButton
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/contracts/${record.id}/edit`)}
                        size="small"
                        type="link"
                    >
                        Sửa
                    </BaseButton>
                    <BaseDeleteButton
                        entityLabel="hợp đồng"
                        onConfirm={() => remove(record)}
                    />
                </BaseActionGroup>
            ),
        },
    ]

    return (
        <BaseListView
            columns={columns}
            data={list.data}
            filters={
                <BaseFilter
                    fields={filterFields}
                    loading={list.loading}
                    onReset={filters.reset}
                    onSearch={filters.search}
                    values={filters.filters}
                />
            }
            header={
                <BasePageHeader
                    actions={
                        <BaseButton
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/contracts/new')}
                            type="primary"
                        >
                            Tạo hợp đồng
                        </BaseButton>
                    }
                    description="Theo dõi hợp đồng phát sinh từ giao dịch Marketplace."
                    title="Hợp đồng"
                />
            }
            loading={list.loading}
            onChange={(pagination) =>
                filters.paginate(pagination.current, pagination.pageSize)
            }
            pagination={{
                total: list.meta.pagination?.total,
                current: list.meta.pagination?.current_page,
                pageSize: list.meta.pagination?.per_page,
                showSizeChanger: true,
            }}
        />
    )
}
