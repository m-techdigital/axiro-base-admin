import { Descriptions, Tag, Typography } from 'antd'
import { useEffect } from 'react'

import {
    statusColor,
    statusLabel,
    valueLabel,
} from '@/contracts/marketplaceLabels'

import BaseConfirmActionButton from './BaseConfirmActionButton'
import BaseForm from './BaseForm'
import BaseModal from './BaseModal'

const reasonFields = [
    {
        name: 'reason',
        label: 'Lý do từ chối',
        type: 'textarea',
        rows: 4,
        span: 24,
        placeholder:
            'Nêu rõ lý do để khách hàng biết cần bổ sung hoặc điều chỉnh gì.',
        rules: [
            { required: true, message: 'Vui lòng nhập lý do từ chối.' },
            { min: 5, message: 'Lý do từ chối cần ít nhất 5 ký tự.' },
        ],
    },
]

export default function BaseReviewActionModal({
    approveText = 'Duyệt',
    children,
    description,
    loading = false,
    onApprove,
    onCancel,
    onReject,
    open,
    record,
    rejectText = 'Từ chối',
    summary = [],
    title = 'Xử lý yêu cầu',
}) {
    const [form] = BaseForm.useForm()

    useEffect(() => {
        if (open) form.resetFields()
    }, [form, open, record?.id])

    const submitReject = async () => {
        const { reason } = await form.validateFields(['reason'])
        await onReject?.(String(reason).trim())
    }

    return (
        <BaseModal
            footer={null}
            loading={loading}
            onCancel={onCancel}
            open={open}
            title={title}
            width={640}
        >
            {description ? (
                <Typography.Paragraph type="secondary">
                    {description}
                </Typography.Paragraph>
            ) : null}
            {summary.length ? (
                <Descriptions
                    bordered
                    column={1}
                    items={summary.map((item, index) => ({
                        key: item.key || index,
                        label: item.label,
                        children:
                            item.type === 'status' ? (
                                <Tag color={statusColor(item.value)}>
                                    {statusLabel(
                                        item.value,
                                        valueLabel(item.value),
                                    )}
                                </Tag>
                            ) : (
                                (item.children ?? item.value ?? '—')
                            ),
                    }))}
                    size="small"
                />
            ) : null}
            {children ? (
                <div className="base-review-action-modal__content">
                    {children}
                </div>
            ) : null}
            {onReject ? (
                <BaseForm
                    className="base-review-action-form"
                    fields={reasonFields}
                    form={form}
                    showFooter={false}
                />
            ) : null}
            <div className="base-review-action-modal__actions">
                <BaseConfirmActionButton
                    content="Sau khi duyệt, trạng thái nghiệp vụ sẽ được cập nhật và ghi vào nhật ký hệ thống."
                    disabled={loading}
                    okText={approveText}
                    onConfirm={onApprove}
                    title={`${approveText} yêu cầu này?`}
                    type="primary"
                >
                    {approveText}
                </BaseConfirmActionButton>
                {onReject ? (
                    <BaseConfirmActionButton
                        danger
                        content="Lý do đã nhập sẽ được lưu và hiển thị cho bên liên quan."
                        disabled={loading}
                        okText={rejectText}
                        onConfirm={submitReject}
                        title={`${rejectText} yêu cầu này?`}
                    >
                        {rejectText}
                    </BaseConfirmActionButton>
                ) : null}
            </div>
        </BaseModal>
    )
}
