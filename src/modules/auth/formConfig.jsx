import { Input } from 'antd'

export const loginDefaultValues = { username: 'admin' }

export const loginFormFields = [
    {
        name: 'username',
        label: 'Tên đăng nhập',
        rules: [{ required: true }],
    },
    {
        name: 'password',
        label: 'Mật khẩu',
        rules: [{ required: true }],
        render: () => <Input.Password />,
    },
]
