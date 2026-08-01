import { Modal } from 'antd'
import BaseButton from './BaseButton.jsx'

export default function BaseConfirmActionButton({
    module,
    action,

    title = 'Xác nhận',
    content = 'Bạn có chắc chắn không?',

    okText = 'Xác nhận',
    cancelText = 'Huỷ',

    onConfirm,
    onClick,

    danger = false,
    icon,
    color = 'blue',

    children,
    ...props
}) {
    const handleClick = (e) => {
        e?.stopPropagation?.()

        onClick?.(e)

        Modal.confirm({
            title,
            content,
            okText,
            cancelText,
            okButtonProps: {
                danger,
            },
            onOk: onConfirm,
        })
    }

    return (
        <BaseButton
            module={module}
            action={action}
            icon={icon}
            color={color}
            variant="outlined"
            onClick={handleClick}
            {...props}
        >
            {children}
        </BaseButton>
    )
}
