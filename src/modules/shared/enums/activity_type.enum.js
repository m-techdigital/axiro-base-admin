import {
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SyncOutlined,
    MessageOutlined,
} from '@ant-design/icons'

export const ACTIVITY_TYPE = {
    CREATED: 'created',
    UPDATED: 'updated',
    DELETED: 'deleted',
    APPROVED: 'approved',
    STATUS_CHANGED: 'status_changed',
    INTERACTION: 'interaction',
}

export const ACTIVITY_TYPE_META = {
    [ACTIVITY_TYPE.CREATED]: {
        label: 'Tạo mới',
        color: '#22c55e',
        icon: PlusOutlined,
    },
    [ACTIVITY_TYPE.UPDATED]: {
        label: 'Cập nhật',
        color: '#3b82f6',
        icon: EditOutlined,
    },
    [ACTIVITY_TYPE.DELETED]: {
        label: 'Hủy/Từ chối',
        color: '#ef4444',
        icon: DeleteOutlined,
    },
    [ACTIVITY_TYPE.APPROVED]: {
        label: 'Phê duyệt',
        color: '#2563eb',
        icon: CheckOutlined,
    },
    [ACTIVITY_TYPE.STATUS_CHANGED]: {
        label: 'Đổi trạng thái',
        color: '#f59e0b',
        icon: SyncOutlined,
    },
    [ACTIVITY_TYPE.INTERACTION]: {
        label: 'Hoạt động',
        color: '#8b5cf6',
        icon: MessageOutlined,
    },
}

export const ACTIVITY_CODE_META = {}
