import { BaseForm } from '@/components/base'
import { Button, Card, Input, InputNumber, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import service from '../service'
import PageHeader from '../../../components/base/PageHeader'
export default function ProductForm() {
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
            n('/products')
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
            <PageHeader title={id ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'} />
            <Card className="form-card">
                <BaseForm
                    form={f}
                    layout="vertical"
                    onFinish={save}
                    initialValues={{
                        status: 'active',
                        price: 0,
                        product_type: 'game_account',
                    }}
                >
                    <BaseForm.Item
                        name="code"
                        label="Mã"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="name"
                        label="Tên"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item name="product_type" label="Loại sản phẩm">
                        <Select
                            options={[
                                {
                                    value: 'game_account',
                                    label: 'Tài khoản trò chơi',
                                },
                                { value: 'service', label: 'Dịch vụ' },
                            ]}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item name="game_code" label="Trò chơi">
                        <Select
                            allowClear
                            options={[
                                {
                                    value: 'ninja_school',
                                    label: 'Ninja School',
                                },
                                { value: 'dragon_ball', label: 'Ngọc Rồng' },
                                { value: 'avatar', label: 'Avatar' },
                            ]}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item name="server_name" label="Máy chủ">
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item name="level" label="Cấp độ">
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={['draft', 'active', 'inactive'].map(
                                (x) => ({ value: x, label: x }),
                            )}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="price"
                        label="Giá tham chiếu"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item name="image_url" label="Ảnh đại diện">
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item name="description" label="Mô tả">
                        <Input.TextArea rows={4} />
                    </BaseForm.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Lưu
                    </Button>{' '}
                    <Button onClick={() => n('/products')}>Hủy</Button>
                </BaseForm>
            </Card>
        </div>
    )
}
