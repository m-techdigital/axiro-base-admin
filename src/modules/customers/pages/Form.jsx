import { CUSTOMER_STATUS_OPTIONS } from '@/constants/options'
import { BaseForm, BaseButton } from '@/components/base'
import { Card, Input, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../components/base/PageHeader'
import service from '../service'
export default function CustomerForm() {
    const { id } = useParams(),
        n = useNavigate(),
        [f] = BaseForm.useForm(),
        [loading, setLoading] = useState(false)
    useEffect(() => {
        if (id) service.get(id).then((r) => f.setFieldsValue(r.data))
    }, [id, f])
    const save = async (v) => {
        setLoading(true)
        try {
            id ? await service.update(id, v) : await service.create(v)
            message.success('Đã lưu')
            n('/customers')
        } catch (e) {
            if (e.errors)
                f.setFields(
                    Object.entries(e.errors).map(([name, errors]) => ({
                        name,
                        errors,
                    })),
                )
            message.error(e.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="page">
            <PageHeader title={id ? 'Cập nhật khách hàng' : 'Tạo khách hàng'} />
            <Card className="form-card">
                <BaseForm
                    form={f}
                    layout="vertical"
                    onFinish={save}
                    initialValues={{ status: 'active' }}
                >
                    <BaseForm.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="name"
                        label="Tên khách hàng"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item name="email" label="Email">
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item name="phone" label="Điện thoại">
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="password"
                        label={
                            id
                                ? 'Mật khẩu mới (để trống nếu không đổi)'
                                : 'Mật khẩu'
                        }
                        rules={id ? [] : [{ required: true }, { min: 8 }]}
                    >
                        <Input.Password />
                    </BaseForm.Item>
                    <BaseForm.Item name="status" label="Trạng thái">
                        <Select options={CUSTOMER_STATUS_OPTIONS} />
                    </BaseForm.Item>
                    <BaseButton
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Lưu
                    </BaseButton>{' '}
                    <BaseButton onClick={() => n('/customers')}>Hủy</BaseButton>
                </BaseForm>
            </Card>
        </div>
    )
}
