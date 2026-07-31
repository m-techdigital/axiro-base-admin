import { Popconfirm } from 'antd'

import BaseButton from './BaseButton'

export default function BaseConfirmActionButton({
    children,
    confirmTitle = 'Xác nhận thao tác?',
    confirmDescription,
    okText = 'Xác nhận',
    cancelText = 'Hủy',
    onConfirm,
    ...buttonProps
}) {
    return (
        <Popconfirm
            cancelText={cancelText}
            description={confirmDescription}
            okText={okText}
            onConfirm={onConfirm}
            title={confirmTitle}
        >
            <BaseButton {...buttonProps}>{children}</BaseButton>
        </Popconfirm>
    )
}
