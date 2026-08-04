import { List } from 'antd'
import { BaseConfirmActionButton } from '../../../components/base'
import { formatCurrency } from '../../../utils/format'

export default function TransactionPendingPayments({
    payments = [],
    onConfirmPayment,
}) {
    if (!payments.length) return null

    return (
        <List
            size="small"
            header={<strong>Thanh toán cần xử lý</strong>}
            dataSource={payments}
            renderItem={(payment) => (
                <List.Item
                    actions={
                        payment.status === 'submitted'
                            ? [
                                  <BaseConfirmActionButton
                                      key="confirm"
                                      size="small"
                                      title="Xác nhận thanh toán"
                                      content="Chỉ xác nhận khi đã đối soát chứng từ và số tiền thực nhận."
                                      okText="Xác nhận"
                                      onConfirm={() =>
                                          onConfirmPayment(payment.id)
                                      }
                                  >
                                      Xác nhận
                                  </BaseConfirmActionButton>,
                              ]
                            : []
                    }
                >
                    <span>
                        {payment.code} · {formatCurrency(payment.amount)} ·{' '}
                        {payment.status}
                    </span>
                </List.Item>
            )}
        />
    )
}
