import { DeleteOutlined } from '@ant-design/icons'

import BaseConfirmActionButton from './BaseConfirmActionButton'

export default function BaseDeleteButton({
    entityLabel = 'dữ liệu',
    onConfirm,
    ...props
}) {
    return (
        <BaseConfirmActionButton
            danger
            confirmTitle={`Xóa ${entityLabel}?`}
            icon={<DeleteOutlined />}
            onConfirm={onConfirm}
            type="link"
            {...props}
        >
            Xóa
        </BaseConfirmActionButton>
    )
}
