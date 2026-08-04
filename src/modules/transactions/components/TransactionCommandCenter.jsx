import { Alert, List, Space, Typography } from 'antd'
import { lazy, Suspense } from 'react'
import { BaseButton } from '../../../components/base'

const TransactionCommandGuidance = lazy(
    () => import('./TransactionCommandGuidance'),
)
const TransactionCommandWorkflow = lazy(
    () => import('./TransactionCommandWorkflow'),
)
const TransactionPendingPayments = lazy(
    () => import('./TransactionPendingPayments'),
)

const actionTone = { high: 'primary', medium: 'default', low: 'default' }

function CommandSurfaceFallback({ label }) {
    return (
        <div aria-live="polite" className="transaction-command-surface-loading">
            {label}
        </div>
    )
}

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
    const pendingPayments = center.pending_payments || []
    const guidance = lifecycle.guidance || []

    return (
        <div className="transaction-command-center" aria-busy={loading}>
            <Typography.Title level={4}>
                Trung tâm xử lý giao dịch
            </Typography.Title>
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                <Alert
                    showIcon
                    type={lifecycle.next_action ? 'info' : 'success'}
                    title={
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
                {guidance.length ? (
                    <Suspense
                        fallback={
                            <CommandSurfaceFallback label="Đang tải hướng dẫn vận hành…" />
                        }
                    >
                        <TransactionCommandGuidance guidance={guidance} />
                    </Suspense>
                ) : null}
                <Suspense
                    fallback={
                        <CommandSurfaceFallback label="Đang tải tiến độ hồ sơ…" />
                    }
                >
                    <TransactionCommandWorkflow checklist={checklist} />
                </Suspense>
                {pendingPayments.length ? (
                    <Suspense
                        fallback={
                            <CommandSurfaceFallback label="Đang tải thanh toán cần xử lý…" />
                        }
                    >
                        <TransactionPendingPayments
                            payments={pendingPayments}
                            onConfirmPayment={onConfirmPayment}
                        />
                    </Suspense>
                ) : null}
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
                {blocked.length ? (
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
                ) : null}
            </Space>
        </div>
    )
}
