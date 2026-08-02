import { EyeOutlined } from '@ant-design/icons'
import { Select, Tag, Input, message } from 'antd'
import { useEffect, useState } from 'react'

import {
    BaseActionGroup,
    BaseFilter,
    BaseIconAction,
    BaseListView,
    BaseModal,
    BasePageHeader,
    BaseButton,
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
    const [outcome, setOutcome] = useState('cancel_refund')
    const [resolution, setResolution] = useState('')

    const resolve = async (status) => {
        if (resolution.trim().length < 10) {
            message.warning('Cần nhập kết luận xử lý tối thiểu 10 ký tự')
            return
        }
        try {
            await service.resolve(item.id, {
                status,
                resolution: resolution.trim(),
                outcome: status === 'rejected' ? 'reopen' : outcome,
            })
            message.success('Đã xử lý tranh chấp')
            setItem(null)
            setOutcome('cancel_refund')
            setResolution('')
            await list.reload()
        } catch (error) {
            message.error(error.message)
        }
    }

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
                            setResolution('')
                            setOutcome('cancel_refund')
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
                    <BaseButton
                        danger
                        key="reject"
                        onClick={() => resolve('rejected')}
                    >
                        Từ chối
                    </BaseButton>,
                    <BaseButton
                        key="resolve"
                        onClick={() => resolve('resolved')}
                        type="primary"
                    >
                        Áp dụng phương án
                    </BaseButton>,
                ]}
                onCancel={() => setItem(null)}
                open={Boolean(item)}
                title="Xử lý tranh chấp"
            >
                <p>
                    <b>Mô tả:</b> {item?.description}
                </p>
                <p>
                    <b>Phương án khi chấp nhận:</b>
                </p>
                <Select
                    value={outcome}
                    onChange={setOutcome}
                    style={{ width: '100%', marginBottom: 12 }}
                    options={disputeOutcomes.filter(
                        ({ value }) => value !== 'reopen',
                    )}
                />
                <p>
                    <b>Kết luận xử lý:</b>
                </p>
                <Input.TextArea
                    rows={4}
                    value={resolution}
                    onChange={(event) => setResolution(event.target.value)}
                    placeholder="Nhập kết luận, căn cứ và phương án xử lý"
                />
            </BaseModal>
        </>
    )
}
