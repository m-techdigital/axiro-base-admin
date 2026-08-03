import { Alert, List, Progress, Space, Tag, Typography } from 'antd'
import { BaseButton, BaseConfirmActionButton } from '../../../components/base'
import { formatCurrency } from '../../../utils/format'

const actionTone = { high: 'primary', medium: 'default', low: 'default' }

export default function TransactionCommandCenter({
    data,
    loading,
    onAction,
    onConfirmPayment,
}) {
    const center = data?.command_center || {}
    const lifecycle = center.lifecycle || {}
    const enabled = (lifecycle.actions || []).filter((item) => item.enabled)
    const blocked = (lifecycle.actions || []).filter((item) => !item.enabled)
    const checklist = center.workflow_checklist || []
    const completed = checklist.filter(
        (item) => item.status === 'completed',
    ).length
    const pendingPayments = center.pending_payments || []

    return (
        <div className="transaction-command-center">
            <Typography.Title level={4}>
                Trung tâm xử lý giao dịch
            </Typography.Title>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Alert
                    showIcon
                    type={lifecycle.next_action ? 'info' : 'success'}
                    message={
                        lifecycle.next_action
                            ? `Việc cần làm: ${lifecycle.next_action.label}`
                            : 'Không còn thao tác bắt buộc'
                    }
                    description={
                        lifecycle.status?.label
                            ? `Trạng thái hiện tại: ${lifecycle.status.label}`
                            : undefined
                    }
                />
                <div>
                    <Typography.Text strong>Tiến độ hồ sơ</Typography.Text>
                    <Progress
                        percent={
                            checklist.length
                                ? Math.round(
                                      (completed / checklist.length) * 100,
                                  )
                                : 0
                        }
                        size="small"
                    />
                    <Space wrap>
                        {checklist.map((item) => (
                            <Tag
                                key={item.key}
                                color={
                                    item.status === 'completed'
                                        ? 'green'
                                        : item.status === 'attention'
                                          ? 'red'
                                          : 'default'
                                }
                            >
                                {item.label}: {item.detail}
                            </Tag>
                        ))}
                    </Space>
                </div>
                {!!pendingPayments.length && (
                    <List
                        size="small"
                        header={
                            <Typography.Text strong>
                                Thanh toán cần xử lý
                            </Typography.Text>
                        }
                        dataSource={pendingPayments}
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
                                                      onConfirmPayment(
                                                          payment.id,
                                                      )
                                                  }
                                              >
                                                  Xác nhận
                                              </BaseConfirmActionButton>,
                                          ]
                                        : []
                                }
                            >
                                <span>
                                    {payment.code} ·{' '}
                                    {formatCurrency(payment.amount)} ·{' '}
                                    {payment.status}
                                </span>
                            </List.Item>
                        )}
                    />
                )}
                <Space wrap>
                    {enabled
                        .filter((item) => item.key !== 'confirm_payment')
                        .map((item) => (
                            <BaseButton
                                key={item.key}
                                type={actionTone[item.priority]}
                                onClick={() => onAction(item.key)}
                            >
                                {item.label}
                            </BaseButton>
                        ))}
                </Space>
                {!!blocked.length && (
                    <List
                        size="small"
                        header={
                            <Typography.Text type="secondary">
                                Thao tác đang khóa
                            </Typography.Text>
                        }
                        dataSource={blocked}
                        renderItem={(item) => (
                            <List.Item>
                                <Typography.Text disabled>
                                    {item.label}: {item.blocked_reason}
                                </Typography.Text>
                            </List.Item>
                        )}
                    />
                )}
            </Space>
        </div>
    )
}
