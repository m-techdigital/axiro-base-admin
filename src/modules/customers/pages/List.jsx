import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Tag, message } from 'antd'
import { useNavigate } from 'react-router'

import {
    BaseActionGroup,
    BaseButton,
    BaseDeleteButton,
    BaseFilter,
    BaseListView,
    BasePageHeader,
} from '@/components/base'
import { statusColor, statusLabel } from '@/contracts/marketplaceLabels'
import { useBaseFilters, useList } from '@/hooks'

import service from '../service'

const filterFields = [
    {
        name: 'keyword',
        label: 'Từ khóa',
        type: 'search',
        placeholder: 'Tên, tài khoản hoặc điện thoại',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: ['active', 'inactive', 'blocked'].map((value) => ({
            value,
            label: statusLabel(value),
        })),
    },
]

export default function CustomerList() {
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
            message.success('Đã xóa khách hàng')
            await list.reload()
        } catch (error) {
            message.error(error.message)
        }
    }

    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tên đăng nhập', dataIndex: 'username' },
        { title: 'Khách hàng', dataIndex: 'name' },
        { title: 'Điện thoại', dataIndex: 'phone' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) => (
                <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
            ),
        },
        {
            title: 'Số dư',
            render: (_, record) =>
                `${Number(record.wallet?.available_balance || 0).toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            fixed: 'right',
            render: (_, record) => (
                <BaseActionGroup
                    actions={[
                        {
                            key: 'edit',
                            label: 'Sửa',
                            icon: <EditOutlined />,
                            onClick: () =>
                                navigate(`/customers/${record.id}/edit`),
                        },
                    ]}
                >
                    <BaseDeleteButton
                        entityLabel="khách hàng"
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
                            onClick={() => navigate('/customers/new')}
                            type="primary"
                        >
                            Tạo khách hàng
                        </BaseButton>
                    }
                    description="Quản lý hồ sơ, trạng thái và số dư khách hàng Marketplace."
                    title="Khách hàng"
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
