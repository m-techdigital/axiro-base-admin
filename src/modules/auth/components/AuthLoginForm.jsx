import BaseButton from '@/components/base/BaseButton'
import Form from 'antd/es/form'
import Input from 'antd/es/input'

export default function AuthLoginForm({ loading, initialValues, onFinish }) {
    return (
        <Form
            initialValues={initialValues}
            layout="vertical"
            requiredMark={false}
            onFinish={onFinish}
        >
            <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[{ required: true, message: 'Nhập tên đăng nhập.' }]}
            >
                <Input autoComplete="username" />
            </Form.Item>
            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Nhập mật khẩu.' }]}
            >
                <Input.Password autoComplete="current-password" />
            </Form.Item>
            <BaseButton
                block
                htmlType="submit"
                loading={loading}
                type="primary"
            >
                Đăng nhập
            </BaseButton>
        </Form>
    )
}
