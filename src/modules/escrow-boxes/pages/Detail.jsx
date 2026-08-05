import { useEffect, useMemo, useState } from 'react'
import { Descriptions, Space, Tag, message } from 'antd'
import { useNavigate, useParams } from 'react-router'

import {
    BaseAsyncState,
    BaseButton,
    BaseFormModal,
    BasePageHeader,
    BaseTable,
    Money,
} from '@/components/base'
import service from '../service'

const reviewFields = [
    {
        name: 'action',
        label: 'Quyết định',
        type: 'select',
        required: true,
        options: [
            { value: 'approve', label: 'Phê duyệt' },
            { value: 'request_changes', label: 'Yêu cầu bổ sung' },
            { value: 'reject', label: 'Từ chối' },
        ],
    },
    {
        name: 'risk_level',
        label: 'Mức rủi ro',
        type: 'select',
        required: true,
        options: ['low', 'medium', 'high', 'blocked'].map((value) => ({
            value,
            label: value,
        })),
    },
    {
        name: 'handover_sequence',
        label: 'Thứ tự bàn giao',
        type: 'select',
        options: [
            { value: 'party_a_first', label: 'Bên A trước' },
            { value: 'party_b_first', label: 'Bên B trước' },
            {
                value: 'simultaneous_admin_observed',
                label: 'Đồng thời dưới giám sát',
            },
        ],
    },
    {
        name: 'base_fee_override',
        label: 'Phí cơ bản điều chỉnh',
        type: 'number',
    },
    {
        name: 'percentage_rate_override',
        label: 'Tỷ lệ phí điều chỉnh (%)',
        type: 'number',
    },
    {
        name: 'fee_payer_override',
        label: 'Bên chịu phí điều chỉnh',
        type: 'select',
        options: [
            { value: 'party_a', label: 'Bên A' },
            { value: 'party_b', label: 'Bên B' },
            { value: 'split_equal', label: 'Chia đều' },
        ],
    },
    {
        name: 'fee_override_reason',
        label: 'Lý do điều chỉnh phí',
        type: 'textarea',
        span: 12,
    },
    {
        name: 'review_note',
        label: 'Ghi chú thẩm định',
        type: 'textarea',
        span: 12,
    },
]

const reviewDefaults = {
    action: 'approve',
    risk_level: 'low',
    handover_sequence: 'party_a_first',
}

export default function EscrowBoxDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    const load = async () => {
        setLoading(true)
        try {
            const response = await service.get(id)
            setData(response.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [id])

    const terms = data?.agreement_terms || {}
    const handoverColumns = useMemo(
        () => [
            { title: 'Bên', dataIndex: 'party_side' },
            { title: 'Bước', dataIndex: 'step_type' },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                render: (value) => <Tag>{value}</Tag>,
            },
            {
                title: 'Bằng chứng',
                render: (_, row) => row.media?.length || 0,
            },
            {
                title: 'Xử lý',
                render: (_, row) =>
                    row.status === 'submitted' ? (
                        <Space>
                            <BaseButton
                                onClick={async () => {
                                    await service.reviewHandover(id, row.id, {
                                        action: 'verify',
                                        expected_version: row.expected_version,
                                    })
                                    message.success('Đã xác minh')
                                    load()
                                }}
                            >
                                Xác minh
                            </BaseButton>
                            <BaseButton
                                danger
                                onClick={async () => {
                                    await service.reviewHandover(id, row.id, {
                                        action: 'request_more',
                                        expected_version: row.expected_version,
                                        note: 'Cần bổ sung bằng chứng rõ hơn.',
                                    })
                                    message.success('Đã yêu cầu bổ sung')
                                    load()
                                }}
                            >
                                Yêu cầu bổ sung
                            </BaseButton>
                        </Space>
                    ) : (
                        '—'
                    ),
            },
        ],
        [id],
    )

    return (
        <BaseAsyncState loading={loading} data={data}>
            <BasePageHeader
                title={`Box ${data?.code || ''}`}
                description="Không hiển thị danh tính này cho hai bên; chỉ Admin được sử dụng để thẩm định."
                onBack={() => navigate('/escrow-boxes')}
                actions={
                    data?.status === 'admin_review' ? (
                        <BaseButton type="primary" onClick={() => setOpen(true)}>
                            Thẩm định box
                        </BaseButton>
                    ) : null
                }
            />
            <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Bên A">
                    {data?.party_a?.code} — {data?.party_a?.username}
                </Descriptions.Item>
                <Descriptions.Item label="Bên B">
                    {data?.party_b
                        ? `${data.party_b.code} — ${data.party_b.username}`
                        : 'Chưa có'}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag>{data?.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Phiên bản">
                    {data?.agreement_version}
                </Descriptions.Item>
                <Descriptions.Item label="Tiền bù">
                    <Money value={data?.topup_amount} />
                </Descriptions.Item>
                <Descriptions.Item label="Phí cuối">
                    <Money value={data?.final_fee} />
                </Descriptions.Item>
                <Descriptions.Item label="Tài sản Bên A">
                    {terms.party_a_asset?.title}
                    <br />
                    {terms.party_a_asset?.description}
                </Descriptions.Item>
                <Descriptions.Item label="Tài sản Bên B">
                    {terms.party_b_asset?.title}
                    <br />
                    {terms.party_b_asset?.description}
                </Descriptions.Item>
                <Descriptions.Item label="Điều kiện thành công" span={2}>
                    {terms.success_conditions}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú Admin" span={2}>
                    {data?.admin_review_note || '—'}
                </Descriptions.Item>
            </Descriptions>
            <BaseTable
                rowKey="id"
                columns={handoverColumns}
                dataSource={data?.handover_steps || []}
                pagination={false}
            />
            <BaseFormModal
                title="Thẩm định box"
                open={open}
                fields={reviewFields}
                record={{
                    ...reviewDefaults,
                    expected_version: data?.expected_version,
                }}
                onCancel={() => setOpen(false)}
                onFinish={async (values) => {
                    await service.review(id, {
                        ...values,
                        expected_version: data.expected_version,
                    })
                    message.success('Đã cập nhật thẩm định')
                    setOpen(false)
                    load()
                }}
                submitText="Xác nhận"
            />
        </BaseAsyncState>
    )
}
