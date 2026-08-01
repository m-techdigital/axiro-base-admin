import { BaseForm, BaseButton } from '@/components/base'
import { Card, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import service from '../service'
import { setAuth } from '../../../utils/auth'
import { useAuth } from '../../../hooks/useAuth'
export default function Login() {
    const [loading, setLoading] = useState(false),
        n = useNavigate(),
        { setUser } = useAuth()
    const submit = async (v) => {
        setLoading(true)
        try {
            const r = await service.login(v)
            setAuth(r.data)
            const me = await service.me()
            setUser(me.data)
            message.success('Đăng nhập thành công')
            n('/')
        } catch (e) {
            message.error(e.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="login">
            <Card className="login-card">
                <Typography.Title level={2}>AXIRO Base</Typography.Title>
                <Typography.Paragraph type="secondary">
                    Đăng nhập quản trị
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <b>Tài khoản mẫu:</b> admin / change-me
                </Typography.Paragraph>
                <BaseForm
                    layout="vertical"
                    onFinish={submit}
                    initialValues={{ username: 'admin' }}
                >
                    <BaseForm.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </BaseForm.Item>
                    <BaseButton
                        block
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Đăng nhập
                    </BaseButton>
                </BaseForm>
            </Card>
        </div>
    )
}
