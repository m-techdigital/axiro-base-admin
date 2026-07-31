import { BaseModal } from '@/components/base'
import {
    statusColor,
    statusLabel,
    valueLabel,
} from '../../../contracts/marketplaceLabels'
import {
    Alert,
    Button,
    Card,
    Col,
    Descriptions,
    List,
    Row,
    Space,
    Tag,
    Timeline,
    Typography,
    message,
} from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../components/base/PageHeader'
import Money from '../../../components/base/Money'
import documentService from '../../generated-documents/service'
import service from '../service'

const labels = {
    purchase: 'Mua bán',
    rental: 'Thuê',
    pending_payment: 'Chờ thanh toán',
    partially_paid: 'Đã thanh toán một phần',
    paid: 'Đã thanh toán',
    handover_pending: 'Chờ bên nhận xác nhận',
    handed_over: 'Đã bàn giao',
    active: 'Đang thuê',
    return_pending: 'Chờ xác nhận hoàn trả',
    returned: 'Đã hoàn trả',
    completed: 'Hoàn tất',
    cancelled: 'Đã hủy',
    disputed: 'Đang tranh chấp',
}
const documentLabels = {
    sale_contract: 'Hợp đồng mua bán',
    rental_contract: 'Hợp đồng thuê',
    installment_appendix: 'Phụ lục trả góp',
    deposit_confirmation: 'Thỏa thuận đặt cọc',
    payment_confirmation: 'Xác nhận thanh toán',
    handover_minutes: 'Biên bản bàn giao',
    return_minutes: 'Biên bản hoàn trả',
    dispute_minutes: 'Tiếp nhận tranh chấp',
    dispute_resolution: 'Xử lý tranh chấp',
    refund_settlement: 'Hoàn tiền và đối soát',
    completion_minutes: 'Hoàn tất giao dịch',
    security_checklist: 'Kiểm tra bảo mật',
    platform_transaction_record: 'Phiếu ghi nhận giao dịch',
}

export default function TransactionDetail() {
    const { id } = useParams(),
        navigate = useNavigate()
    const [data, setData] = useState(null),
        [loading, setLoading] = useState(true),
        [acting, setActing] = useState(''),
        [preview, setPreview] = useState(null)
    const load = async () => {
        setLoading(true)
        try {
            const r = await service.get(id)
            setData(r.data)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        load()
    }, [id])
    const act = (action, title) =>
        BaseModal.confirm({
            title,
            content:
                'Hành động quản trị sẽ được ghi vào nhật ký và thông báo cho cả hai bên.',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                setActing(action)
                try {
                    await service.action(id, { action, note: title })
                    message.success('Đã cập nhật giao dịch')
                    await load()
                } catch (e) {
                    message.error(e.message)
                } finally {
                    setActing('')
                }
            },
        })
    const ensureDocuments = async () => {
        setActing('documents')
        try {
            await documentService.ensure(id)
            message.success('Đã đồng bộ bộ tài liệu theo trạng thái giao dịch')
            await load()
        } finally {
            setActing('')
        }
    }
    const viewDocument = async (document) =>
        setPreview((await documentService.preview(document.id)).data)
    const downloadDocument = async (document) => {
        const blob = await documentService.download(document.id)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${document.code}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    }
    return (
        <div className="page">
            <PageHeader
                title={`Giao dịch ${data?.code || ''}`}
                actions={
                    <Space>
                        <Button onClick={() => navigate('/transactions')}>
                            Quay lại
                        </Button>
                        <Button onClick={load}>Tải lại</Button>
                    </Space>
                }
            />
            {data?.status === 'disputed' && (
                <Alert
                    type="warning"
                    showIcon
                    message="Giao dịch đang tranh chấp"
                    description="Không nên hoàn tất hoặc hủy trước khi đối chiếu đầy đủ bằng chứng."
                />
            )}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} xl={15}>
                    <Card loading={loading} title="Thông tin giao dịch">
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Loại">
                                {labels[data?.transaction_type] ||
                                    data?.transaction_type}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={statusColor(data?.status)}>
                                    {statusLabel(data?.status)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tài khoản">
                                {data?.product?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tin đăng">
                                {data?.listing?.code || '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Người mua / thuê">
                                {data?.buyer?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Người bán / cho thuê">
                                {data?.seller?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền">
                                <Money value={data?.total_payable} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Đã thanh toán">
                                <Money value={data?.paid_amount} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Đang tạm giữ">
                                <Money value={data?.escrow_amount} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Đã giải ngân">
                                <Money value={data?.released_amount} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Đã hoàn">
                                <Money value={data?.refunded_amount} />
                            </Descriptions.Item>
                            {data?.transaction_type === 'rental' && (
                                <>
                                    <Descriptions.Item label="Kỳ hạn thuê">
                                        {data?.rental_period_count}{' '}
                                        {data?.rental_period_unit}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Cách thu tiền">
                                        {data?.rental_billing_mode ===
                                        'periodic'
                                            ? 'Theo từng kỳ'
                                            : 'Thu trước toàn kỳ'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Bắt đầu thuê">
                                        {data?.rental_start_at
                                            ? new Date(
                                                  data.rental_start_at,
                                              ).toLocaleString('vi-VN')
                                            : '—'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Hết hạn thuê">
                                        {data?.rental_end_at
                                            ? new Date(
                                                  data.rental_end_at,
                                              ).toLocaleString('vi-VN')
                                            : '—'}
                                    </Descriptions.Item>
                                </>
                            )}
                        </Descriptions>
                    </Card>
                    <Card
                        loading={loading}
                        title="Kế hoạch thanh toán"
                        style={{ marginTop: 16 }}
                    >
                        <List
                            dataSource={data?.payments || []}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Tag
                                            key="status"
                                            color={
                                                item.status === 'confirmed'
                                                    ? 'green'
                                                    : item.status === 'rejected'
                                                      ? 'red'
                                                      : 'gold'
                                            }
                                        >
                                            {statusLabel(item.status)}
                                        </Tag>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={`${item.code} · ${valueLabel(item.component_type || item.payment_type)}${item.installment_number ? ` · kỳ ${item.installment_number}` : ''}${item.cycle_number ? ` · chu kỳ ${item.cycle_number}` : ''}`}
                                        description={`Kỳ áp dụng: ${item.period_start || '—'} → ${item.period_end || '—'} · Hạn: ${item.due_date || '—'} · Nguồn: ${valueLabel(item.payment_method, 'Chưa chọn')} · Đối soát: ${statusLabel(item.settlement_status || 'unsettled')} · Tham chiếu: ${item.reference || '—'}`}
                                    />
                                    <Money value={item.amount} />
                                </List.Item>
                            )}
                        />
                    </Card>
                    <Card
                        title="Hồ sơ tài liệu"
                        style={{ marginTop: 16 }}
                        extra={
                            <Button
                                type="primary"
                                loading={acting === 'documents'}
                                onClick={ensureDocuments}
                            >
                                Đồng bộ tài liệu
                            </Button>
                        }
                    >
                        <List
                            dataSource={data?.documents || []}
                            locale={{
                                emptyText:
                                    'Chưa phát hành tài liệu cho giao dịch này.',
                            }}
                            renderItem={(document) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            key="view"
                                            onClick={() =>
                                                viewDocument(document)
                                            }
                                        >
                                            Xem
                                        </Button>,
                                        <Button
                                            key="download"
                                            onClick={() =>
                                                downloadDocument(document)
                                            }
                                        >
                                            Tải PDF
                                        </Button>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={`${documentLabels[document.document_type] || document.title} · phiên bản ${document.version}`}
                                        description={`${document.code} · ${document.acceptances?.length || 0}/2 bên đã xác nhận`}
                                    />
                                    <Tag
                                        color={
                                            (document.acceptances?.length ||
                                                0) >= 2
                                                ? 'green'
                                                : 'gold'
                                        }
                                    >
                                        {document.status}
                                    </Tag>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col xs={24} xl={9}>
                    <Card loading={loading} title="Tiến trình hai phía">
                        <Timeline
                            items={(data?.events || []).map((item) => ({
                                children: (
                                    <>
                                        <b>{item.title}</b>
                                        <div>{item.description || ''}</div>
                                        <small>
                                            {new Date(
                                                item.created_at,
                                            ).toLocaleString('vi-VN')}
                                        </small>
                                    </>
                                ),
                            }))}
                        />
                    </Card>
                    <Card
                        loading={loading}
                        title="Lịch sử kiểm tra hệ thống"
                        style={{ marginTop: 16 }}
                    >
                        <Timeline
                            items={(data?.audit_history || [])
                                .slice(0, 30)
                                .map((item) => ({
                                    color:
                                        item.risk_level === 'high'
                                            ? 'red'
                                            : item.audit_type === 'validation'
                                              ? 'gold'
                                              : 'blue',
                                    children: (
                                        <>
                                            <b>{item.title}</b>
                                            <div>{item.description || ''}</div>
                                            <small>
                                                {new Date(
                                                    item.created_at,
                                                ).toLocaleString('vi-VN')}{' '}
                                                · {item.actor_type || 'system'}{' '}
                                                #{item.actor_id || '—'}
                                            </small>
                                            {item.request_id && (
                                                <div>
                                                    <Typography.Text
                                                        copyable={{
                                                            text: item.request_id,
                                                        }}
                                                    >
                                                        Mã yêu cầu:{' '}
                                                        {item.request_id.slice(
                                                            0,
                                                            8,
                                                        )}
                                                        …
                                                    </Typography.Text>
                                                </div>
                                            )}
                                        </>
                                    ),
                                }))}
                        />
                    </Card>
                    <Card title="Can thiệp quản trị" style={{ marginTop: 16 }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                block
                                loading={acting === 'force_handover'}
                                onClick={() =>
                                    act(
                                        'force_handover',
                                        'Xác nhận hoàn tất bàn giao',
                                    )
                                }
                            >
                                Xác nhận bàn giao
                            </Button>
                            {data?.transaction_type === 'rental' && (
                                <Button
                                    block
                                    loading={acting === 'force_return'}
                                    onClick={() =>
                                        act(
                                            'force_return',
                                            'Xác nhận hoàn trả tài khoản thuê',
                                        )
                                    }
                                >
                                    Xác nhận hoàn trả
                                </Button>
                            )}
                            <Button
                                block
                                type="primary"
                                loading={acting === 'complete'}
                                onClick={() =>
                                    act('complete', 'Hoàn tất giao dịch')
                                }
                            >
                                Hoàn tất giao dịch
                            </Button>
                            <Button
                                block
                                danger
                                loading={acting === 'cancel'}
                                onClick={() => act('cancel', 'Hủy giao dịch')}
                            >
                                Hủy giao dịch
                            </Button>
                            <Button
                                block
                                loading={acting === 'reopen'}
                                onClick={() =>
                                    act(
                                        'reopen',
                                        'Mở lại giao dịch về trạng thái chờ thanh toán',
                                    )
                                }
                            >
                                Mở lại giao dịch
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
            <BaseModal
                open={!!preview}
                onCancel={() => setPreview(null)}
                footer={null}
                width={900}
                title={preview?.title}
            >
                <div
                    className="document-preview"
                    dangerouslySetInnerHTML={{ __html: preview?.html || '' }}
                />
            </BaseModal>
        </div>
    )
}
