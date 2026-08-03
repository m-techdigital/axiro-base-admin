import { BaseForm, BaseFormPage } from '@/components/base'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productDefaultValues, productFormFields } from '../formConfig'
import service from '../service'

export default function ProductForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = BaseForm.useForm()
    const [loading, setLoading] = useState(false)
    const [record, setRecord] = useState(null)

    useEffect(() => {
        if (!id) {
            setRecord(null)
            return
        }

        service.get(id).then((response) => setRecord(response.data))
    }, [id])

    const save = async (values) => {
        setLoading(true)
        try {
            await (id ? service.update(id, values) : service.create(values))
            message.success('Đã lưu')
            navigate('/products')
        } finally {
            setLoading(false)
        }
    }

    return (
        <BaseFormPage
            description="Quản lý tài sản theo product_type, offer_modes và điều kiện giao dịch của Mini."
            title={id ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
        >
            <BaseForm
                fields={productFormFields}
                form={form}
                initialValues={productDefaultValues}
                loading={loading}
                onCancel={() => navigate('/products')}
                onFinish={save}
                record={record}
                showFooter
                submitText="Lưu sản phẩm"
            />
        </BaseFormPage>
    )
}
