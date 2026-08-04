import { BaseButton } from '@/components/base'
import { Card, Space, Typography } from 'antd'
import { useNavigate } from 'react-router'

export default function TransactionAdminActionsPanel({
    data,
    acting,
    act,
    onOpenRentalCompletion,
}) {
    const navigate = useNavigate()
    const actions = data?.admin_actions || []
    return (
        <Card title="Can thiệp quản trị" style={{ marginTop: 16 }}>
            <Space orientation="vertical" style={{ width: '100%' }}>
                {actions.includes('force_handover') && (
                    <BaseButton
                        block
                        loading={acting === 'force_handover'}
                        onClick={() =>
                            act('force_handover', 'Xác nhận hoàn tất bàn giao')
                        }
                    >
                        Xác nhận bàn giao
                    </BaseButton>
                )}
                {actions.includes('force_return') && (
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
                {actions.includes('complete') && (
                    <BaseButton
                        block
                        type="primary"
                        loading={acting === 'complete'}
                        onClick={() =>
                            data?.transaction_type === 'rental'
                                ? onOpenRentalCompletion()
                                : act('complete', 'Hoàn tất giao dịch')
                        }
                    >
                        Hoàn tất giao dịch
                    </BaseButton>
                )}
                {actions.includes('cancel') && (
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
                {actions.includes('reopen') && (
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
                        !['resolved', 'rejected', 'cancelled'].includes(
                            item.status,
                        ),
                ) && (
                    <BaseButton block onClick={() => navigate('/disputes')}>
                        Mở hồ sơ tranh chấp
                    </BaseButton>
                )}
                {!actions.length && (
                    <Typography.Text type="secondary">
                        Không có thao tác quản trị phù hợp với trạng thái hiện
                        tại.
                    </Typography.Text>
                )}
            </Space>
        </Card>
    )
}
