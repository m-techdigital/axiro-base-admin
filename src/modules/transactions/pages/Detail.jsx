import {
    BaseConfirmActionButton,
    BaseButton,
    BasePageHeader,
    BaseView,
} from '@/components/base'
import Money from '../../../components/base/Money'
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
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import TransactionCommandCenter from '../components/TransactionCommandCenter'
import TransactionDetailModals from '../components/TransactionDetailModals'
import {
    buildTransactionDetailFields,
    transactionLabels,
} from '../config/detailPresentation'
import useTransactionDetail from '../hooks/useTransactionDetail'

export default function TransactionDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const {
        data,
        loading,
        acting,
        preview,
        documentLabels,
        disputeOutcomeLabels,
        deductionModalOpen,
        deductionAmount,
        deductionNote,
        load,
        act,
        confirmPayment,
        completeRental,
        closeDeductionModal,
        ensureDocuments,
        viewDocument,
        downloadDocument,
        setPreview,
        setDeductionModalOpen,
        setDeductionAmount,
        setDeductionNote,
    } = useTransactionDetail(id)
    return (
        <div className="page">
            <BasePageHeader
                title={`Giao dịch ${data?.code || ''}`}
                description="Theo dõi thanh toán, tài liệu, tranh chấp và các hành động khép vòng giao dịch."
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
            <TransactionCommandCenter
                data={data}
                loading={loading}
                onAction={(action) =>
                    act(
                        action,
                        `Thực hiện: ${transactionLabels[action] || action}`,
                    )
                }
                onConfirmPayment={(paymentId) => confirmPayment(paymentId)}
            />
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} xl={15}>
                    <Card loading={loading} title="Thông tin giao dịch">
                        <BaseView
                            record={data}
                            columns={2}
                            fields={buildTransactionDetailFields(data)}
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
                                                  <BaseConfirmActionButton
                                                      key="confirm"
                                                      title="Xác nhận thanh toán"
                                                      content="Chỉ xác nhận khi đã đối soát chứng từ và số tiền thực nhận."
                                                      okText="Xác nhận"
                                                      type="link"
                                                      loading={
                                                          acting ===
                                                          `payment-${item.id}`
                                                      }
                                                      onConfirm={() =>
                                                          confirmPayment(
                                                              item.id,
                                                          )
                                                      }
                                                  >
                                                      Xác nhận
                                                  </BaseConfirmActionButton>,
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
                            <BaseConfirmActionButton
                                type="primary"
                                loading={acting === 'documents'}
                                title="Đồng bộ tài liệu"
                                content="Hệ thống sẽ tạo hoặc cập nhật bộ tài liệu theo trạng thái hiện tại của giao dịch."
                                okText="Đồng bộ"
                                onConfirm={ensureDocuments}
                            >
                                Đồng bộ tài liệu
                            </BaseConfirmActionButton>
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
                                        {item.metadata?.outcome && (
                                            <Tag color="purple">
                                                Kết quả:{' '}
                                                {disputeOutcomeLabels[
                                                    item.metadata.outcome
                                                ] ||
                                                    valueLabel(
                                                        item.metadata.outcome,
                                                    )}
                                            </Tag>
                                        )}
                                        {Number(
                                            item.metadata
                                                ?.rental_deposit_deduction_amount ||
                                                0,
                                        ) > 0 && (
                                            <div>
                                                Khấu trừ cọc:{' '}
                                                <Money
                                                    value={
                                                        item.metadata
                                                            .rental_deposit_deduction_amount
                                                    }
                                                />
                                            </div>
                                        )}
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
                                        data?.transaction_type === 'rental'
                                            ? setDeductionModalOpen(true)
                                            : act(
                                                  'complete',
                                                  'Hoàn tất giao dịch',
                                              )
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
            <TransactionDetailModals
                data={data}
                acting={acting}
                deductionModalOpen={deductionModalOpen}
                deductionAmount={deductionAmount}
                deductionNote={deductionNote}
                preview={preview}
                onCloseDeduction={closeDeductionModal}
                onCompleteRental={completeRental}
                onDeductionAmountChange={setDeductionAmount}
                onDeductionNoteChange={setDeductionNote}
                onClosePreview={() => setPreview(null)}
            />
        </div>
    )
}
