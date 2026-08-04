import { EyeOutlined } from '@ant-design/icons'
import { Tag, message } from 'antd'
import { useEffect, useState } from 'react'

import {
    BaseActionGroup,
    BaseFilter,
    BaseIconAction,
    BaseListView,
    BaseModal,
    BasePageHeader,
    BaseForm,
    BaseConfirmActionButton,
} from '@/components/base'
import { useBaseFilters, useList } from '@/hooks'

import { statusColor, statusLabel } from '../../../contracts/marketplaceLabels'
import service from '../service'
import { loadMarketplaceOptions } from '@/services/marketplaceOptions'

const filterFields = [
    {
        name: 'keyword',
        label: 'Mã hoặc nội dung tranh chấp',
        type: 'search',
        placeholder: 'Mã hoặc nội dung tranh chấp',
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
            { value: 'open', label: 'Đang mở' },
            { value: 'resolved', label: 'Đã giải quyết' },
            { value: 'rejected', label: 'Đã từ chối' },
        ],
    },
]

export default function DisputeList() {
    const list = useList(service, { page: 1, per_page: 20 })
    const filters = useBaseFilters({
        defaultParams: { page: 1, per_page: 20 },
        onSearch: list.setParams,
        onReset: list.setParams,
    })
    const [disputeOutcomes, setDisputeOutcomes] = useState([])
    useEffect(() => {
        loadMarketplaceOptions().then((options) =>
            setDisputeOutcomes(options.dispute_outcomes || []),
        )
    }, [])
    const [item, setItem] = useState(null)
    const [form] = BaseForm.useForm()

    const resolve = async (status) => {
        if (!item) return
        try {
            const values = await form.validateFields()
            await service.resolve(item.id, {
                status,
                resolution: values.resolution.trim(),
                outcome: status === 'rejected' ? 'reopen' : values.outcome,
            })
            message.success('Đã xử lý tranh chấp')
            setItem(null)
            form.resetFields()
            await list.reload()
        } catch (error) {
            if (!error?.errorFields) message.error(error.message)
        }
    }

    const disputeFields = [
        {
            name: 'outcome',
            label: 'Phương án xử lý',
            type: 'select',
            span: 24,
            options: disputeOutcomes.filter(({ value }) => value !== 'reopen'),
            rules: [
                { required: true, message: 'Vui lòng chọn phương án xử lý.' },
            ],
        },
        {
            name: 'resolution',
            label: 'Kết luận xử lý',
            type: 'textarea',
            rows: 5,
            span: 24,
            placeholder:
                'Nêu căn cứ, bằng chứng và tác động tới thanh toán/hoàn tiền.',
            rules: [
                { required: true, message: 'Vui lòng nhập kết luận xử lý.' },
                { min: 10, message: 'Kết luận cần ít nhất 10 ký tự.' },
            ],
        },
    ]

    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Giao dịch', render: (_, record) => record.transaction?.code },
        {
            title: 'Người mở',
            render: (_, record) =>
                record.opened_by?.name || record.openedBy?.name,
        },
        { title: 'Lý do', dataIndex: 'reason' },
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
                        label="Xử lý tranh chấp"
                        onClick={() => {
                            setItem(record)
                            form.setFieldsValue({
                                outcome: 'cancel_refund',
                                resolution: '',
                            })
                        }}
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
                        description="Đối chiếu bằng chứng và xử lý tranh chấp theo giao dịch."
                        title="Tranh chấp"
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
                footer={[
                    <BaseConfirmActionButton
                        danger
                        key="reject"
                        content="Tranh chấp bị từ chối sẽ được mở lại luồng nghiệp vụ liên quan theo kết luận đã nhập."
                        okText="Từ chối"
                        onConfirm={() => resolve('rejected')}
                        title="Từ chối tranh chấp?"
                    >
                        Từ chối
                    </BaseConfirmActionButton>,
                    <BaseConfirmActionButton
                        key="resolve"
                        content="Phương án xử lý sẽ tác động tới giao dịch và dòng tiền liên quan."
                        okText="Áp dụng phương án"
                        onConfirm={() => resolve('resolved')}
                        title="Xác nhận xử lý tranh chấp?"
                        type="primary"
                    >
                        Áp dụng phương án
                    </BaseConfirmActionButton>,
                ]}
                onCancel={() => {
                    setItem(null)
                    form.resetFields()
                }}
                open={Boolean(item)}
                title={`Xử lý ${item?.code || 'tranh chấp'}`}
                width={720}
            >
                <p>
                    <b>Mô tả:</b> {item?.description || item?.reason || '—'}
                </p>
                <BaseForm
                    fields={disputeFields}
                    form={form}
                    initialValues={{ outcome: 'cancel_refund' }}
                    showFooter={false}
                />
            </BaseModal>
        </>
    )
}
