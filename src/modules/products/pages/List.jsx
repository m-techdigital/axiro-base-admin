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
        placeholder: 'Tìm theo mã hoặc tên sản phẩm',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { value: 'active', label: 'Đang hoạt động' },
            { value: 'inactive', label: 'Tạm ngưng' },
        ],
    },
]

export default function ProductList() {
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
            message.success('Đã xóa sản phẩm')
            await list.reload()
        } catch (error) {
            message.error(error.message)
        }
    }

    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tên sản phẩm', dataIndex: 'name' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) => <Tag>{value}</Tag>,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (value) => <Money value={value} />,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            fixed: 'right',
            render: (_, record) => (
                <BaseActionGroup>
                    <BaseButton
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/products/${record.id}/edit`)}
                        size="small"
                        type="link"
                    >
                        Sửa
                    </BaseButton>
                    <BaseDeleteButton
                        entityLabel="sản phẩm"
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
                            onClick={() => navigate('/products/new')}
                            type="primary"
                        >
                            Tạo sản phẩm
                        </BaseButton>
                    }
                    description="Quản lý sản phẩm nền tảng dùng cho tin đăng và giao dịch."
                    title="Sản phẩm"
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
