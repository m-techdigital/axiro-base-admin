import { BaseForm, BaseFormPage } from '@/components/base'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
    createTransactionFormFields,
    toTransactionFormRecord,
    transactionDefaultValues,
} from '../formConfig'
import service from '../service'

export default function TransactionForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = BaseForm.useForm()
    const [loading, setLoading] = useState(false)
    const [record, setRecord] = useState(null)
    const fields = createTransactionFormFields()

    useEffect(() => {
        if (!id) {
            setRecord(null)
            return
        }

        service
            .get(id)
            .then((response) =>
                setRecord(toTransactionFormRecord(response.data)),
            )
    }, [id])

    const save = async (values) => {
        setLoading(true)
        try {
            await (id ? service.update(id, values) : service.create(values))
            message.success('Đã lưu')
            navigate('/transactions')
        } finally {
            setLoading(false)
        }
    }

    return (
        <BaseFormPage
            description="Giao dịch là vòng đời chính thay cho hợp đồng trong Mini."
            title={id ? 'Cập nhật giao dịch' : 'Tạo giao dịch'}
        >
            <BaseForm
                fields={fields}
                form={form}
                initialValues={transactionDefaultValues}
                loading={loading}
                onCancel={() => navigate('/transactions')}
                onFinish={save}
                record={record}
                showFooter
                submitText="Lưu giao dịch"
            />
        </BaseFormPage>
    )
}
