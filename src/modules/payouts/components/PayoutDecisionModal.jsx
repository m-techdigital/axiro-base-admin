import { BaseConfirmActionButton, BaseModal } from '@/components/base'
import Money from '@/components/base/Money'
import { Alert, Descriptions, Input, Space, Typography } from 'antd'
import service from '../service'

export default function PayoutDecisionModal({
    active,
    selected,
    note,
    reference,
    onNoteChange,
    onReferenceChange,
    onAct,
    onClose,
}) {
    return (
        <BaseModal
            open={Boolean(selected)}
            onCancel={onClose}
            footer={null}
            title="Xử lý yêu cầu"
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                {active === 'withdrawals' && selected?.journey ? (
                    <>
                        <Alert
                            showIcon
                            type={
                                selected.journey.next_action
                                    ? 'info'
                                    : 'success'
                            }
                            message={
                                selected.journey.next_action?.label ||
                                selected.journey.blocked_reason
                            }
                        />
                        <Descriptions
                            bordered
                            size="small"
                            column={1}
                            items={[
                                {
                                    key: 'verification',
                                    label: 'Xác minh người bán',
                                    children:
                                        selected.journey.customer_context
                                            ?.verification_status || '—',
                                },
                                {
                                    key: 'account',
                                    label: 'Tài khoản nhận tiền',
                                    children:
                                        selected.journey.customer_context
                                            ?.payout_account_status || '—',
                                },
                                {
                                    key: 'available',
                                    label: 'Số dư khả dụng',
                                    children: (
                                        <Money
                                            value={
                                                selected.journey
                                                    .customer_context
                                                    ?.available_balance
                                            }
                                        />
                                    ),
                                },
                                {
                                    key: 'held',
                                    label: 'Đang tạm giữ',
                                    children: (
                                        <Money
                                            value={
                                                selected.journey
                                                    .customer_context
                                                    ?.held_balance
                                            }
                                        />
                                    ),
                                },
                            ]}
                        />
                    </>
                ) : null}
                <Typography.Text type="secondary">
                    Mọi quyết định sẽ được ghi nhận để đối soát.
                </Typography.Text>
                <Input.TextArea
                    value={note}
                    onChange={(event) => onNoteChange(event.target.value)}
                    placeholder="Ghi chú xử lý"
                />
                {active === 'withdrawals' ? (
                    <Input
                        value={reference}
                        onChange={(event) =>
                            onReferenceChange(event.target.value)
                        }
                        placeholder="Mã tham chiếu chuyển khoản"
                    />
                ) : null}
                <Space wrap>
                    {active === 'verifications' ? (
                        <>
                            <BaseConfirmActionButton
                                type="primary"
                                title="Xác minh người bán"
                                content="Xác nhận hồ sơ người bán đã hợp lệ để tiếp tục luồng nhận tiền."
                                okText="Xác minh"
                                onConfirm={() =>
                                    onAct(() =>
                                        service.reviewVerification(
                                            selected.id,
                                            'verify',
                                            note,
                                        ),
                                    )
                                }
                            >
                                Xác minh
                            </BaseConfirmActionButton>
                            <BaseConfirmActionButton
                                danger
                                title="Từ chối hồ sơ người bán"
                                content="Hồ sơ bị từ chối sẽ yêu cầu khách hàng cập nhật và gửi lại."
                                okText="Từ chối"
                                onConfirm={() =>
                                    onAct(() =>
                                        service.reviewVerification(
                                            selected.id,
                                            'reject',
                                            note || 'Hồ sơ chưa hợp lệ',
                                        ),
                                    )
                                }
                            >
                                Từ chối
                            </BaseConfirmActionButton>
                        </>
                    ) : null}
                    {active === 'accounts' ? (
                        <>
                            <BaseConfirmActionButton
                                type="primary"
                                title="Xác minh tài khoản nhận tiền"
                                content="Tài khoản đã xác minh có thể được dùng để tạo yêu cầu rút tiền."
                                okText="Xác minh"
                                onConfirm={() =>
                                    onAct(() =>
                                        service.reviewAccount(
                                            selected.id,
                                            'verify',
                                            note,
                                        ),
                                    )
                                }
                            >
                                Xác minh
                            </BaseConfirmActionButton>
                            <BaseConfirmActionButton
                                danger
                                title="Từ chối tài khoản nhận tiền"
                                content="Tài khoản bị từ chối sẽ không được dùng để rút tiền."
                                okText="Từ chối"
                                onConfirm={() =>
                                    onAct(() =>
                                        service.reviewAccount(
                                            selected.id,
                                            'reject',
                                            note || 'Tài khoản chưa hợp lệ',
                                        ),
                                    )
                                }
                            >
                                Từ chối
                            </BaseConfirmActionButton>
                        </>
                    ) : null}
                    {active === 'withdrawals' ? (
                        <>
                            <BaseConfirmActionButton
                                title="Duyệt yêu cầu rút tiền"
                                content="Chỉ duyệt khi điều kiện xác minh, tài khoản nhận và số dư khả dụng đã phù hợp."
                                okText="Duyệt"
                                onConfirm={() =>
                                    onAct(() => service.approve(selected.id))
                                }
                            >
                                Duyệt
                            </BaseConfirmActionButton>
                            <BaseConfirmActionButton
                                type="primary"
                                disabled={!reference}
                                title="Xác nhận đã chi trả"
                                content="Hành động này xác nhận tiền đã được chuyển theo mã tham chiếu đã nhập."
                                okText="Xác nhận đã chi"
                                onConfirm={() =>
                                    onAct(() =>
                                        service.paid(selected.id, reference),
                                    )
                                }
                            >
                                Xác nhận đã chi
                            </BaseConfirmActionButton>
                            <BaseConfirmActionButton
                                danger
                                title="Từ chối yêu cầu rút tiền"
                                content="Yêu cầu bị từ chối sẽ hoàn lại tiền đang tạm giữ."
                                okText="Từ chối"
                                onConfirm={() =>
                                    onAct(() =>
                                        service.reject(
                                            selected.id,
                                            note || 'Yêu cầu không hợp lệ',
                                        ),
                                    )
                                }
                            >
                                Từ chối
                            </BaseConfirmActionButton>
                        </>
                    ) : null}
                </Space>
            </Space>
        </BaseModal>
    )
}
