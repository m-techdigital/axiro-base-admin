import { Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import BaseButton from './BaseButton.jsx'

export default function BaseDeleteButton({
    module,
    action,
    type,
    title = 'Xác nhận xoá',
    content,
    entityLabel = 'bản ghi',

    okText = 'Xóa',
    cancelText = 'Hủy',

    onConfirm,
    onClick,

    danger = true,
    children,

    ...props
}) {
    // ======================
    // ACTION
    // ======================
    const handleDelete = (e) => {
        e?.stopPropagation?.()

        onClick?.(e)

        Modal.confirm({
            title,
            content: content || `Bạn có chắc muốn xoá ${entityLabel} này?`,
            okText,
            cancelText,

            okButtonProps: {
                danger,
            },

            onOk: onConfirm,
        })
    }

    // ======================
    // UI
    // ======================
    return (
        <BaseButton
            module={module}
            action={action}
            type={type}
            danger={danger}
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            {...props}
        >
            {children}
        </BaseButton>
    )
}
