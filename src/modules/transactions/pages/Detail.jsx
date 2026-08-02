import { BaseModal, BaseButton, BaseView } from '@/components/base'
import {
    statusColor,
    statusLabel,
    valueLabel,
} from '../../../contracts/marketplaceLabels'
import {
    Alert,
    Card,
    Col,
    List,
    Row,
    Space,
    Tag,
    Timeline,
    Typography,
    message,
} from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../components/base/PageHeader'
import Money from '../../../components/base/Money'
import documentService from '../../generated-documents/service'
import service from '../service'
import {
    loadMarketplaceOptions,
    optionMap,
} from '@/services/marketplaceOptions'

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
export default function TransactionDetail() {
    const { id } = useParams(),
        navigate = useNavigate()
    const [documentTypes, setDocumentTypes] = useState([])
    const documentLabels = useMemo(
        () => optionMap(documentTypes),
        [documentTypes],
    )
    useEffect(() => {
        loadMarketplaceOptions().then((options) =>
            setDocumentTypes(options.document_types || []),
        )
    }, [])
    const [data, setData] = useState(null),
        [loading, setLoading] = useState(true),
        [acting, setActing] = useState(''),
        [preview, setPreview] = useState(null)
    const load = useCallback(async () => {
        setLoading(true)
        try {
            const r = await service.get(id)
            setData(r.data)
        } finally {
            setLoading(false)
        }
    }, [id])
    useEffect(() => {
        load()
    }, [load])
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
    const confirmPayment = async (paymentId) => {
        setActing(`payment-${paymentId}`)
        try {
            await service.confirmPayment(paymentId)
            message.success('Đã xác nhận thanh toán')
            await load()
        } catch (error) {
            message.error(error.message || 'Không thể xác nhận thanh toán')
        } finally {
            setActing('')
        }
    }
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
    const viewDocument = async (transactionDocument) =>
        setPreview((await documentService.preview(transactionDocument.id)).data)
    const downloadDocument = async (transactionDocument) => {
        const blob = await documentService.download(transactionDocument.id)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${transactionDocument.code}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    }
    return (
        <div className="page">
            <PageHeader
                title={`Giao dịch ${data?.code || ''}`}
                actions={
                    <Space>
                        <BaseButton onClick={() => navigate('/transactions')}>
                            Quay lại
                        </BaseButton>
                        <BaseButton onClick={load}>Tải lại</BaseButton>
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
                        <BaseView
                            record={data}
                            columns={2}
                            fields={[
                                {
                                    name: 'transaction_type',
                                    label: 'Loại',
                                    type: 'option_tag',
                                    options: Object.entries(labels).map(
                                        ([value, label]) => ({ value, label }),
                                    ),
                                    span: { xs: 24, md: 12 },
                                },
                                {
                                    name: 'status',
                                    label: 'Trạng thái',
                                    type: 'option_tag',
                                    labels: Object.fromEntries(
                                        Object.keys(labels).map((value) => [
                                            value,
                                            statusLabel(value),
                                        ]),
                                    ),
                                    colors: Object.fromEntries(
                                        Object.keys(labels).map((value) => [
                                            value,
                                            statusColor(value),
                                        ]),
                                    ),
                                    span: { xs: 24, md: 12 },
                                },
                                {
                                    name: ['product', 'name'],
                                    label: 'Tài khoản',
                                    type: 'text',
                                    span: { xs: 24, md: 12 },
                                },
                                {
                                    name: ['product', 'code'],
                                    label: 'Sản phẩm',
                                    type: 'text',
                                    span: { xs: 24, md: 12 },
                                },
                                {
                                    name: ['buyer', 'name'],
                                    label: 'Người mua / thuê',
                                    type: 'text',
                                    span: { xs: 24, md: 12 },
                                },
                                {
                                    name: ['seller', 'name'],
                                    label: 'Người bán / cho thuê',
                                    type: 'text',
                                    span: { xs: 24, md: 12 },
                                },
                                {
                                    name: 'total_payable',
                                    label: 'Tổng tiền',
                                    type: 'money',
                                    span: { xs: 24, md: 12 },
                                },
                                {
                                    name: 'paid_amount',
                                    label: 'Đã thanh toán',
                                    type: 'money',
                                    span: { xs: 24, md: 12 },
                                },
                                {
                                    name: 'escrow_amount',
                                    label: 'Đang tạm giữ',
                                    type: 'money',
                                    span: { xs: 24, md: 12 },
                                },
                                {
                                    name: 'released_amount',
                                    label: 'Đã giải ngân',
                                    type: 'money',
                                    span: { xs: 24, md: 12 },
                                },
                                {
                                    name: 'refunded_amount',
                                    label: 'Đã hoàn',
                                    type: 'money',
                                    span: { xs: 24, md: 12 },
                                },
                                ...(data?.transaction_type === 'rental'
                                    ? [
                                          {
                                              name: 'rental_period_count',
                                              label: 'Kỳ hạn thuê',
                                              render: (value, record) =>
                                                  `${value || 0} ${record?.rental_period_unit || ''}`.trim(),
                                              span: { xs: 24, md: 12 },
                                          },
                                          {
                                              name: 'rental_billing_mode',
                                              label: 'Cách thu tiền',
                                              type: 'option',
                                              options: [
                                                  {
                                                      value: 'periodic',
                                                      label: 'Theo từng kỳ',
                                                  },
                                                  {
                                                      value: 'full_term',
                                                      label: 'Thu trước toàn kỳ',
                                                  },
                                              ],
                                              span: { xs: 24, md: 12 },
                                          },
                                          {
                                              name: 'rental_start_at',
                                              label: 'Bắt đầu thuê',
                                              type: 'datetime',
                                              span: { xs: 24, md: 12 },
                                          },
                                          {
                                              name: 'rental_end_at',
                                              label: 'Hết hạn thuê',
                                              type: 'datetime',
                                              span: { xs: 24, md: 12 },
                                          },
                                      ]
                                    : []),
                            ]}
                        />
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
                                        ...(['pending', 'submitted'].includes(
                                            item.status,
                                        )
                                            ? [
                                                  <BaseButton
                                                      key="confirm"
                                                      type="link"
                                                      loading={
                                                          acting ===
                                                          `payment-${item.id}`
                                                      }
                                                      onClick={() =>
                                                          confirmPayment(
                                                              item.id,
                                                          )
                                                      }
                                                  >
                                                      Xác nhận
                                                  </BaseButton>,
                                              ]
                                            : []),
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
                            <BaseButton
                                type="primary"
                                loading={acting === 'documents'}
                                onClick={ensureDocuments}
                            >
                                Đồng bộ tài liệu
                            </BaseButton>
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
                                        <BaseButton
                                            key="view"
                                            onClick={() =>
                                                viewDocument(document)
                                            }
                                        >
                                            Xem
                                        </BaseButton>,
                                        <BaseButton
                                            key="download"
                                            onClick={() =>
                                                downloadDocument(document)
                                            }
                                        >
                                            Tải PDF
                                        </BaseButton>,
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
                                                : statusColor(document.status)
                                        }
                                    >
                                        {statusLabel(
                                            document.status,
                                            valueLabel(
                                                document.status,
                                                document.status || '—',
                                            ),
                                        )}
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
                        title="Checklist xử lý"
                        style={{ marginTop: 16 }}
                    >
                        <List
                            dataSource={data?.workflow_checklist || []}
                            locale={{ emptyText: 'Chưa có dữ liệu checklist.' }}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.label}
                                        description={item.detail}
                                    />
                                    <Tag
                                        color={
                                            item.status === 'completed'
                                                ? 'green'
                                                : item.status === 'attention'
                                                  ? 'red'
                                                  : item.status === 'pending'
                                                    ? 'gold'
                                                    : 'default'
                                        }
                                    >
                                        {item.status === 'completed'
                                            ? 'Đã xong'
                                            : item.status === 'attention'
                                              ? 'Cần xử lý'
                                              : item.status === 'pending'
                                                ? 'Đang chờ'
                                                : 'Không phát sinh'}
                                    </Tag>
                                </List.Item>
                            )}
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
                            {(data?.admin_actions || []).includes(
                                'force_handover',
                            ) && (
                                <BaseButton
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
                                </BaseButton>
                            )}
                            {(data?.admin_actions || []).includes(
                                'force_return',
                            ) && (
                                <BaseButton
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
                                </BaseButton>
                            )}
                            {(data?.admin_actions || []).includes(
                                'complete',
                            ) && (
                                <BaseButton
                                    block
                                    type="primary"
                                    loading={acting === 'complete'}
                                    onClick={() =>
                                        act('complete', 'Hoàn tất giao dịch')
                                    }
                                >
                                    Hoàn tất giao dịch
                                </BaseButton>
                            )}
                            {(data?.admin_actions || []).includes('cancel') && (
                                <BaseButton
                                    block
                                    danger
                                    loading={acting === 'cancel'}
                                    onClick={() =>
                                        act(
                                            'cancel',
                                            'Hủy giao dịch và hoàn phần tiền đang tạm giữ',
                                        )
                                    }
                                >
                                    Hủy và hoàn tiền
                                </BaseButton>
                            )}
                            {(data?.admin_actions || []).includes('reopen') && (
                                <BaseButton
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
                                </BaseButton>
                            )}
                            {(data?.disputes || []).some(
                                (item) =>
                                    ![
                                        'resolved',
                                        'rejected',
                                        'cancelled',
                                    ].includes(item.status),
                            ) && (
                                <BaseButton
                                    block
                                    onClick={() => navigate('/disputes')}
                                >
                                    Mở hồ sơ tranh chấp
                                </BaseButton>
                            )}
                            {!(data?.admin_actions || []).length && (
                                <Typography.Text type="secondary">
                                    Không có thao tác quản trị phù hợp với trạng
                                    thái hiện tại.
                                </Typography.Text>
                            )}
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
