import { EyeOutlined } from '@ant-design/icons'
import { Image, Input, Space, Tag, message } from 'antd'
import { useState } from 'react'

import {
    BaseActionGroup,
    BaseFilter,
    BaseIconAction,
    BaseListView,
    BaseModal,
    BasePageHeader,
    Money,
    BaseButton,
} from '@/components/base'
import { useBaseFilters, useList } from '@/hooks'

import { statusColor, statusLabel } from '../../../contracts/marketplaceLabels'
import service from '../service'

const filterFields = [
    {
        name: 'keyword',
        label: 'Mã yêu cầu hoặc giao dịch ngân hàng',
        type: 'search',
        placeholder: 'Mã yêu cầu hoặc giao dịch ngân hàng',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { value: 'draft', label: 'Chờ chuyển khoản' },
            { value: 'submitted', label: 'Chờ đối soát' },
            { value: 'confirmed', label: 'Đã cộng số dư' },
            { value: 'rejected', label: 'Đã từ chối' },
        ],
    },
]

export default function WalletDepositList() {
    const list = useList(service, { page: 1, per_page: 20 })
    const filters = useBaseFilters({
        defaultParams: { page: 1, per_page: 20 },
        onSearch: list.setParams,
        onReset: list.setParams,
    })
    const [selected, setSelected] = useState(null)
    const [note, setNote] = useState('')

    const act = async (fn, successMessage) => {
        try {
            await fn()
            message.success(successMessage)
            setSelected(null)
            setNote('')
            await list.reload()
        } catch (error) {
            message.error(error.message)
        }
    }

    const columns = [
        { title: 'Mã yêu cầu', dataIndex: 'code' },
        { title: 'Khách hàng', render: (_, record) => record.customer?.name },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (value) => <Money value={value} />,
        },
        {
            title: 'Chứng từ',
            render: (_, record) =>
                record.proof_image_url ? (
                    <Image src={record.proof_image_url} width={64} />
                ) : (
                    'Chưa gửi'
                ),
        },
        { title: 'Mã ngân hàng', dataIndex: 'external_reference' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) => (
                <Tag color={statusColor(value)}>{statusLabel(value)}</Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            fixed: 'right',
            render: (_, record) => (
                <BaseActionGroup>
                    <BaseIconAction
                        icon={<EyeOutlined />}
                        label="Xem và đối soát"
                        onClick={() => setSelected(record)}
                    />
                </BaseActionGroup>
            ),
        },
    ]

    return (
        <>
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
                        description="Theo dõi chứng từ và đối soát yêu cầu nạp tiền của khách hàng."
                        title="Yêu cầu nạp tiền"
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
            <BaseModal
                footer={null}
                onCancel={() => setSelected(null)}
                open={Boolean(selected)}
                title="Đối soát yêu cầu nạp tiền"
            >
                {selected ? (
                    <Space
                        orientation="vertical"
                        size={14}
                        style={{ width: '100%' }}
                    >
                        <div>
                            <b>{selected.customer?.name}</b>
                            <br />
                            <span>
                                {selected.code} ·{' '}
                                <Money value={selected.amount} />
                            </span>
                        </div>
                        {selected.proof_image_url ? (
                            <Image
                                src={selected.proof_image_url}
                                style={{ maxHeight: 420, objectFit: 'contain' }}
                            />
                        ) : (
                            <Tag>Khách hàng chưa gửi chứng từ</Tag>
                        )}
                        <Input.TextArea
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Ghi chú khi từ chối"
                            rows={3}
                            value={note}
                        />
                        <Space wrap>
                            {selected.status === 'submitted' ? (
                                <BaseButton
                                    onClick={() =>
                                        act(
                                            () => service.confirm(selected.id),
                                            'Đã xác nhận và cộng số dư',
                                        )
                                    }
                                    type="primary"
                                >
                                    Xác nhận tiền đã về
                                </BaseButton>
                            ) : null}
                            {['submitted', 'draft'].includes(
                                selected.status,
                            ) ? (
                                <BaseButton
                                    danger
                                    onClick={() =>
                                        act(
                                            () =>
                                                service.reject(
                                                    selected.id,
                                                    note ||
                                                        'Chứng từ chưa hợp lệ hoặc chưa nhận được tiền.',
                                                ),
                                            'Đã từ chối yêu cầu',
                                        )
                                    }
                                >
                                    Từ chối
                                </BaseButton>
                            ) : null}
                        </Space>
                    </Space>
                ) : null}
            </BaseModal>
        </>
    )
}
