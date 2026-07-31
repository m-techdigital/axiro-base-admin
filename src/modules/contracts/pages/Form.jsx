import { BaseForm } from '@/components/base'
import {
    Button,
    Card,
    DatePicker,
    Input,
    InputNumber,
    Select,
    message,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import service from '../service'
import transactions from '../../transactions/service'
import { useRelationOptions } from '../../../hooks/useRelationOptions'
import PageHeader from '../../../components/base/PageHeader'
export default function ContractForm() {
    const { id } = useParams(),
        n = useNavigate(),
        [f] = BaseForm.useForm(),
        [loading, setLoading] = useState(false),
        { options } = useRelationOptions(
            transactions,
            (x) => `${x.code} - ${x.product?.name || ''}`,
        )
    useEffect(() => {
        if (id)
            service.get(id).then((r) => {
                const d = r.data
                f.setFieldsValue({
                    ...d,
                    signed_at: d.signed_at ? dayjs(d.signed_at) : null,
                    start_date: d.start_date ? dayjs(d.start_date) : null,
                    end_date: d.end_date ? dayjs(d.end_date) : null,
                })
            })
    }, [id])
    const save = async (v) => {
        setLoading(true)
        try {
            const d = {
                ...v,
                signed_at: v.signed_at?.format('YYYY-MM-DD'),
                start_date: v.start_date?.format('YYYY-MM-DD'),
                end_date: v.end_date?.format('YYYY-MM-DD'),
            }
            id ? await service.update(id, d) : await service.create(d)
            message.success('Đã lưu')
            n('/contracts')
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
            <PageHeader title={id ? 'Cập nhật hợp đồng' : 'Tạo hợp đồng'} />
            <Card className="form-card">
                <BaseForm
                    form={f}
                    layout="vertical"
                    onFinish={save}
                    initialValues={{ status: 'draft' }}
                >
                    <BaseForm.Item
                        name="code"
                        label="Mã"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="transaction_id"
                        label="Giao dịch"
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="label"
                            options={options}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="contract_value"
                        label="Giá trị (để trống sẽ lấy tổng giao dịch)"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item name="signed_at" label="Ngày ký">
                        <DatePicker style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item name="start_date" label="Ngày bắt đầu">
                        <DatePicker style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item name="end_date" label="Ngày kết thúc">
                        <DatePicker style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item name="status" label="Trạng thái">
                        <Select
                            options={[
                                'draft',
                                'active',
                                'completed',
                                'cancelled',
                            ].map((x) => ({ value: x, label: x }))}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item name="note" label="Ghi chú">
                        <Input.TextArea />
                    </BaseForm.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Lưu
                    </Button>{' '}
                    <Button onClick={() => n('/contracts')}>Hủy</Button>
                </BaseForm>
            </Card>
        </div>
    )
}
