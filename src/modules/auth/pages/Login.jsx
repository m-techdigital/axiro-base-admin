import { Card, Typography, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import AdminThemeProvider from '../../../app/providers/AdminThemeProvider'
import { useAuth } from '../../../hooks/useAuth'
import { setAuth } from '../../../utils/auth'
import AuthLoginForm from '../components/AuthLoginForm'
import { loginDefaultValues } from '../formConfig'
import service from '../service'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const submit = async (values) => {
        setLoading(true)
        try {
            const response = await service.login(values)
            setAuth(response.data)
            const me = await service.me()
            setUser(me.data)
            message.success('Đăng nhập thành công')
            navigate('/')
        } catch (error) {
            message.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminThemeProvider>
            <div className="login">
                <Card className="login-card">
                    <Typography.Title level={2}>AXIRO Base</Typography.Title>
                    <Typography.Paragraph type="secondary">
                        Đăng nhập quản trị
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        <b>Tài khoản mẫu:</b> admin / change-me
                    </Typography.Paragraph>
                    <AuthLoginForm
                        initialValues={loginDefaultValues}
                        loading={loading}
                        onFinish={submit}
                    />
                </Card>
            </div>
        </AdminThemeProvider>
    )
}
