import { CUSTOMER_STATUS_OPTIONS } from '@/constants/options'
import { Input } from 'antd'

export const customerDefaultValues = { status: 'active' }

export const createCustomerFormFields = ({ isEdit = false } = {}) => [
    {
        name: 'username',
        label: 'Tên đăng nhập',
        rules: [{ required: true }],
        span: 12,
    },
    {
        name: 'name',
        label: 'Tên khách hàng',
        rules: [{ required: true }],
        span: 12,
    },
    { name: 'email', label: 'Email', span: 12 },
    { name: 'phone', label: 'Điện thoại', span: 12 },
    {
        name: 'password',
        label: isEdit ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu',
        rules: isEdit ? [] : [{ required: true }, { min: 8 }],
        span: 16,
        omitWhenEmpty: true,
        render: () => <Input.Password />,
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: CUSTOMER_STATUS_OPTIONS,
        span: 8,
    },
]
