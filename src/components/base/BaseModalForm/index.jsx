import { Button, Space } from 'antd'

import BaseModal from '@/components/base/BaseModal'

import './base-modal-form.css'

export default function BaseModalForm({
    bodyClassName = '',
    cancelProps,
    cancelText = 'Hủy',
    children,
    className = '',
    footer,
    loading = false,
    onCancel,
    onSubmit,
    open,
    submitProps,
    submitText = 'Đồng ý',
    width = 800,
    ...props
}) {
    const resolvedFooter =
        footer === undefined && onSubmit ? (
            <div className="base-modal-form-footer">
                <Space>
                    <Button onClick={onCancel} {...cancelProps}>
                        {cancelText}
                    </Button>
                    <Button
                        loading={loading}
                        onClick={onSubmit}
                        type="primary"
                        {...submitProps}
                    >
                        {submitText}
                    </Button>
                </Space>
            </div>
        ) : (
            footer
        )

    return (
        <BaseModal
            bodyClassName={`base-modal-form-body ${bodyClassName}`.trim()}
            className={`crud-form-modal ${className}`.trim()}
            footer={resolvedFooter ?? null}
            mask={{ closable: false }}
            onCancel={onCancel}
            open={open}
            width={width}
            {...props}
        >
            {children}
        </BaseModal>
    )
}
