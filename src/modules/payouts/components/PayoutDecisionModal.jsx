import {
    BaseConfirmActionButton,
    BaseForm,
    BaseModal,
    Money,
} from '@/components/base'
import { statusLabel } from '@/contracts/marketplaceLabels'
import { Alert, Descriptions, Space, Typography } from 'antd'
import { useEffect, useMemo } from 'react'

import service from '../service'

export default function PayoutDecisionModal({
    active,
    note,
    onAct,
    onClose,
    onNoteChange,
    onReferenceChange,
    reference,
    selected,
}) {
    const [form] = BaseForm.useForm()

    useEffect(() => {
        if (!selected) return
        form.setFieldsValue({ note, reference })
    }, [form, note, reference, selected])

    const fields = useMemo(
        () => [
            {
                name: 'note',
                label: 'Ghi chú xử lý',
                type: 'textarea',
                rows: 4,
                span: 24,
                placeholder:
                    'Nêu rõ căn cứ xác minh hoặc lý do từ chối để đối soát.',
            },
            ...(active === 'withdrawals'
                ? [
                      {
                          name: 'reference',
                          label: 'Mã tham chiếu chuyển khoản',
                          type: 'text',
                          span: 24,
                          placeholder: 'Bắt buộc khi xác nhận đã chi trả.',
                      },
                  ]
                : []),
        ],
        [active],
    )

    const syncValues = (_, values) => {
        onNoteChange(values.note || '')
        onReferenceChange(values.reference || '')
    }

    const requireRejectReason = () => {
        if (String(note || '').trim().length < 5) {
            form.setFields([
                {
                    name: 'note',
                    errors: ['Vui lòng nhập lý do từ chối ít nhất 5 ký tự.'],
                },
            ])
            return false
        }
        return true
    }

    return (
        <BaseModal
            footer={null}
            onCancel={onClose}
            open={Boolean(selected)}
            title="Xử lý yêu cầu"
            width={640}
        >
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                {active === 'withdrawals' && selected?.journey ? (
                    <>
                        <Alert
                            description={
                                selected.journey.blocked_reason ||
                                'Kiểm tra xác minh, tài khoản nhận tiền và số dư trước khi xử lý.'
                            }
                            showIcon
                            title={
                                selected.journey.next_action?.label ||
                                'Yêu cầu đã hoàn tất điều kiện hiện tại'
                            }
                            type={
                                selected.journey.next_action
                                    ? 'info'
                                    : 'success'
                            }
                        />
                        <Descriptions
                            bordered
                            column={1}
                            items={[
                                {
                                    key: 'verification',
                                    label: 'Xác minh người bán',
                                    children: selected.journey.customer_context
                                        ?.verification_status
                                        ? statusLabel(
                                              selected.journey.customer_context
                                                  .verification_status,
                                          )
                                        : '—',
                                },
                                {
                                    key: 'account',
                                    label: 'Tài khoản nhận tiền',
                                    children: selected.journey.customer_context
                                        ?.payout_account_status
                                        ? statusLabel(
                                              selected.journey.customer_context
                                                  .payout_account_status,
                                          )
                                        : '—',
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
                            size="small"
                        />
                    </>
                ) : null}
                <Typography.Text type="secondary">
                    Mọi quyết định và ghi chú sẽ được lưu trong nhật ký để đối
                    soát.
                </Typography.Text>
                <BaseForm
                    fields={fields}
                    form={form}
                    onValuesChange={syncValues}
                    showFooter={false}
                />
                <div className="base-review-action-modal__actions">
                    {active === 'verifications' ? (
                        <>
                            <BaseConfirmActionButton
                                content="Xác nhận hồ sơ người bán đã hợp lệ."
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
                                title="Xác minh người bán?"
                                type="primary"
                            >
                                Xác minh
                            </BaseConfirmActionButton>
                            <BaseConfirmActionButton
                                danger
                                content="Lý do đã nhập sẽ được gửi tới khách hàng."
                                okText="Từ chối"
                                onConfirm={() =>
                                    requireRejectReason() &&
                                    onAct(() =>
                                        service.reviewVerification(
                                            selected.id,
                                            'reject',
                                            note.trim(),
                                        ),
                                    )
                                }
                                title="Từ chối hồ sơ người bán?"
                            >
                                Từ chối
                            </BaseConfirmActionButton>
                        </>
                    ) : null}
                    {active === 'accounts' ? (
                        <>
                            <BaseConfirmActionButton
                                content="Tài khoản đã xác minh có thể được dùng để nhận payout."
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
                                title="Xác minh tài khoản nhận tiền?"
                                type="primary"
                            >
                                Xác minh
                            </BaseConfirmActionButton>
                            <BaseConfirmActionButton
                                danger
                                content="Lý do đã nhập sẽ được gửi tới khách hàng."
                                okText="Từ chối"
                                onConfirm={() =>
                                    requireRejectReason() &&
                                    onAct(() =>
                                        service.reviewAccount(
                                            selected.id,
                                            'reject',
                                            note.trim(),
                                        ),
                                    )
                                }
                                title="Từ chối tài khoản nhận tiền?"
                            >
                                Từ chối
                            </BaseConfirmActionButton>
                        </>
                    ) : null}
                    {active === 'withdrawals' ? (
                        <>
                            <BaseConfirmActionButton
                                content="Chỉ duyệt khi xác minh, tài khoản nhận và số dư phù hợp."
                                okText="Duyệt"
                                onConfirm={() =>
                                    onAct(() => service.approve(selected.id))
                                }
                                title="Duyệt yêu cầu rút tiền?"
                            >
                                Duyệt
                            </BaseConfirmActionButton>
                            <BaseConfirmActionButton
                                content="Xác nhận tiền đã được chuyển theo mã tham chiếu."
                                disabled={!reference.trim()}
                                okText="Xác nhận đã chi"
                                onConfirm={() =>
                                    onAct(() =>
                                        service.paid(
                                            selected.id,
                                            reference.trim(),
                                        ),
                                    )
                                }
                                title="Xác nhận đã chi trả?"
                                type="primary"
                            >
                                Xác nhận đã chi
                            </BaseConfirmActionButton>
                            <BaseConfirmActionButton
                                danger
                                content="Yêu cầu bị từ chối sẽ hoàn lại tiền đang tạm giữ."
                                okText="Từ chối"
                                onConfirm={() =>
                                    requireRejectReason() &&
                                    onAct(() =>
                                        service.reject(
                                            selected.id,
                                            note.trim(),
                                        ),
                                    )
                                }
                                title="Từ chối yêu cầu rút tiền?"
                            >
                                Từ chối
                            </BaseConfirmActionButton>
                        </>
                    ) : null}
                </div>
            </Space>
        </BaseModal>
    )
}
