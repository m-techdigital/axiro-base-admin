import { BaseConfirmActionButton } from '@/components/base'
import Money from '../../../../components/base/Money'
import {
    statusLabel,
    valueLabel,
} from '../../../../contracts/marketplaceLabels'
import { Card, List, Tag } from 'antd'

export default function TransactionPaymentPanel({
    data,
    loading,
    acting,
    confirmPayment,
}) {
    return (
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
                            ...(['pending', 'submitted'].includes(item.status)
                                ? [
                                      <BaseConfirmActionButton
                                          key="confirm"
                                          title="Xác nhận thanh toán"
                                          content="Chỉ xác nhận khi đã đối soát chứng từ và số tiền thực nhận."
                                          okText="Xác nhận"
                                          type="link"
                                          loading={
                                              acting === `payment-${item.id}`
                                          }
                                          onConfirm={() =>
                                              confirmPayment(item.id)
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
    )
}
