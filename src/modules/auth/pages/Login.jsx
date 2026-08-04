import { BaseForm } from '@/components/base'
import { Card, Typography, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminThemeProvider from '../../../app/providers/AdminThemeProvider'
import { useAuth } from '../../../hooks/useAuth'
import { setAuth } from '../../../utils/auth'
import { loginDefaultValues, loginFormFields } from '../formConfig'
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
                    <BaseForm
                        fields={loginFormFields}
                        initialValues={loginDefaultValues}
                        isCancel={false}
                        loading={loading}
                        onFinish={submit}
                        showFooter
                        submitText="Đăng nhập"
                    />
                </Card>
            </div>
        </AdminThemeProvider>
    )
}
