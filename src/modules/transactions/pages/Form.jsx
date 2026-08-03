import { TRANSACTION_STATUS_OPTIONS } from '@/constants/options'
import { BaseForm, BaseFormFooter, BaseFormPage } from '@/components/base'
import { DatePicker, Input, InputNumber, Select, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import service from '../service'
import products from '../../products/service'
import customers from '../../customers/service'
import { useRelationOptions } from '../../../hooks/useRelationOptions'
export default function TransactionForm() {
    const { id } = useParams(),
        n = useNavigate(),
        [f] = BaseForm.useForm(),
        [loading, setLoading] = useState(false),
        { options: productOptions } = useRelationOptions(
            products,
            (x) => `${x.code} - ${x.name}`,
        ),
        { options: customerOptions } = useRelationOptions(
            customers,
            (x) => `${x.code} - ${x.name}`,
        )
    useEffect(() => {
        if (id)
            service.get(id).then((r) =>
                f.setFieldsValue({
                    ...r.data,
                    transaction_date: dayjs(r.data.transaction_date),
                    due_date: r.data.due_date ? dayjs(r.data.due_date) : null,
                    rental_start_at: r.data.rental_start_at
                        ? dayjs(r.data.rental_start_at)
                        : null,
                    rental_end_at: r.data.rental_end_at
                        ? dayjs(r.data.rental_end_at)
                        : null,
                }),
            )
    }, [id, f])
    const save = async (v) => {
        setLoading(true)
        try {
            const d = {
                ...v,
                transaction_date: v.transaction_date.format('YYYY-MM-DD'),
                due_date: v.due_date?.format('YYYY-MM-DD'),
                rental_start_at: v.rental_start_at?.toISOString(),
                rental_end_at: v.rental_end_at?.toISOString(),
            }
            id ? await service.update(id, d) : await service.create(d)
            message.success('Đã lưu')
            n('/transactions')
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
            description="Giao dịch là vòng đời chính thay cho hợp đồng trong Mini."
            title={id ? 'Cập nhật giao dịch' : 'Tạo giao dịch'}
        >
            <BaseForm
                form={f}
                layout="vertical"
                onFinish={save}
                initialValues={{
                    transaction_type: 'purchase',
                    status: 'pending_payment',
                    transaction_date: dayjs(),
                    service_fee: 0,
                    discount: 0,
                    deposit_amount: 0,
                    paid_amount: 0,
                    refunded_amount: 0,
                }}
            >
                <div className="base-form-grid">
                    <BaseForm.Item
                        className="span-4"
                        name="code"
                        label="Mã"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="transaction_type"
                        label="Loại giao dịch"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: 'purchase', label: 'Mua bán' },
                                { value: 'rental', label: 'Thuê' },
                            ]}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="status"
                        label="Trạng thái"
                    >
                        <Select options={TRANSACTION_STATUS_OPTIONS} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-12"
                        name="product_id"
                        label="Sản phẩm"
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="label"
                            options={productOptions}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-6"
                        name="buyer_customer_id"
                        label="Người mua / thuê"
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="label"
                            options={customerOptions}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-6"
                        name="seller_customer_id"
                        label="Người bán / cho thuê"
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="label"
                            options={customerOptions}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="transaction_value"
                        label="Giá trị"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="service_fee"
                        label="Phí"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="discount"
                        label="Giảm giá"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="deposit_amount"
                        label="Tiền cọc"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="paid_amount"
                        label="Đã thanh toán"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="refunded_amount"
                        label="Đã hoàn"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-6"
                        name="transaction_date"
                        label="Ngày giao dịch"
                        rules={[{ required: true }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-6"
                        name="due_date"
                        label="Hạn thanh toán"
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        noStyle
                        shouldUpdate={(a, b) =>
                            a.transaction_type !== b.transaction_type
                        }
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('transaction_type') === 'rental' ? (
                                <>
                                    <BaseForm.Item
                                        className="span-6"
                                        name="rental_start_at"
                                        label="Bắt đầu thuê"
                                        rules={[{ required: true }]}
                                    >
                                        <DatePicker
                                            showTime
                                            style={{ width: '100%' }}
                                        />
                                    </BaseForm.Item>
                                    <BaseForm.Item
                                        className="span-6"
                                        name="rental_end_at"
                                        label="Kết thúc thuê"
                                        rules={[{ required: true }]}
                                    >
                                        <DatePicker
                                            showTime
                                            style={{ width: '100%' }}
                                        />
                                    </BaseForm.Item>
                                </>
                            ) : null
                        }
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-6"
                        name="payment_method"
                        label="Phương thức thanh toán"
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-12"
                        name="note"
                        label="Ghi chú"
                    >
                        <Input.TextArea rows={4} />
                    </BaseForm.Item>
                </div>
                <BaseFormFooter
                    cancelText="Hủy"
                    loading={loading}
                    onCancel={() => n('/transactions')}
                    submitText="Lưu giao dịch"
                />
            </BaseForm>
        </BaseFormPage>
    )
}
