import { BaseForm, BaseFormPage } from '@/components/base'
import { message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { createCustomerFormFields, customerDefaultValues } from '../formConfig'
import service from '../service'

export default function CustomerForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = BaseForm.useForm()
    const [loading, setLoading] = useState(false)
    const [record, setRecord] = useState(null)
    const fields = useMemo(
        () => createCustomerFormFields({ isEdit: Boolean(id) }),
        [id],
    )

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
            navigate('/customers')
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
                fields={fields}
                form={form}
                initialValues={customerDefaultValues}
                loading={loading}
                onCancel={() => navigate('/customers')}
                onFinish={save}
                record={record}
                showFooter
                submitText="Lưu khách hàng"
            />
        </BaseFormPage>
    )
}
