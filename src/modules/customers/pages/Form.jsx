import { CUSTOMER_STATUS_OPTIONS } from '@/constants/options'
import { BaseForm, BaseFormFooter, BaseFormPage } from '@/components/base'
import { Input, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
        <BaseFormPage
            description="Hồ sơ khách hàng trong phạm vi một admin quản lý nhiều khách hàng."
            title={id ? 'Cập nhật khách hàng' : 'Tạo khách hàng'}
        >
            <BaseForm
                form={f}
                layout="vertical"
                onFinish={save}
                initialValues={{ status: 'active' }}
            >
                <div className="base-form-grid">
                    <BaseForm.Item
                        className="span-6"
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-6"
                        name="name"
                        label="Tên khách hàng"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-6"
                        name="email"
                        label="Email"
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-6"
                        name="phone"
                        label="Điện thoại"
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-8"
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
                    <BaseForm.Item
                        className="span-4"
                        name="status"
                        label="Trạng thái"
                    >
                        <Select options={CUSTOMER_STATUS_OPTIONS} />
                    </BaseForm.Item>
                </div>
                <BaseFormFooter
                    cancelText="Hủy"
                    loading={loading}
                    onCancel={() => n('/customers')}
                    submitText="Lưu khách hàng"
                />
            </BaseForm>
        </BaseFormPage>
    )
}
