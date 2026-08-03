import { Checkbox, Input, InputNumber, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseForm, BaseFormFooter, BaseFormPage } from '@/components/base'
import {
    GAME_OPTIONS,
    PRODUCT_TYPE_OPTIONS,
    PRODUCT_STATUS_OPTIONS,
} from '@/constants/options'
import { OFFER_MODE_OPTIONS } from '@/modules/shared/enums/offer_modes.enum'
import service from '../service'

export default function ProductForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = BaseForm.useForm()
    const [loading, setLoading] = useState(false)
    const offerModes = BaseForm.useWatch('offer_modes', form) || []
    const installmentEnabled = BaseForm.useWatch('installment_enabled', form)

    useEffect(() => {
        if (id)
            service
                .get(id)
                .then((response) => form.setFieldsValue(response.data))
    }, [id, form])

    const save = async (values) => {
        setLoading(true)
        try {
            await (id ? service.update(id, values) : service.create(values))
            message.success('Đã lưu')
            navigate('/products')
        } catch (error) {
            if (error.errors)
                form.setFields(
                    Object.entries(error.errors).map(([name, errors]) => ({
                        name,
                        errors,
                    })),
                )
            message.error(error.message)
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
                form={form}
                layout="vertical"
                onFinish={save}
                initialValues={{
                    status: 'active',
                    product_type: 'game_account',
                    offer_modes: ['sell'],
                    installment_enabled: false,
                    sale_deposit_amount: 0,
                    rental_deposit_amount: 0,
                    installment_interval_unit: 'week',
                    installment_interval_count: 1,
                    rental_billing_mode: 'upfront',
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
                        className="span-8"
                        name="name"
                        label="Tên sản phẩm"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-6"
                        name="game_code"
                        label="Trò chơi"
                        rules={[{ required: true }]}
                    >
                        <Select options={GAME_OPTIONS} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-6"
                        name="product_type"
                        label="Loại sản phẩm"
                        rules={[{ required: true }]}
                    >
                        <Select options={PRODUCT_TYPE_OPTIONS} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="server_name"
                        label="Máy chủ"
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="level"
                        label="Cấp độ"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-4"
                        name="status"
                        label="Trạng thái tài sản"
                    >
                        <Select options={PRODUCT_STATUS_OPTIONS} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-12"
                        name="offer_modes"
                        label="Mục đích giao dịch"
                        rules={[{ required: true, type: 'array', min: 1 }]}
                    >
                        <Checkbox.Group options={OFFER_MODE_OPTIONS} />
                    </BaseForm.Item>
                    {offerModes.includes('sell') && (
                        <>
                            <BaseForm.Item
                                className="span-6"
                                name="sale_price"
                                label="Giá bán"
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                />
                            </BaseForm.Item>
                            <BaseForm.Item
                                className="span-6"
                                name="sale_deposit_amount"
                                label="Tiền cọc khi bán"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                />
                            </BaseForm.Item>
                            <BaseForm.Item
                                className="span-12"
                                name="installment_enabled"
                                valuePropName="checked"
                            >
                                <Checkbox>Cho phép trả góp</Checkbox>
                            </BaseForm.Item>
                        </>
                    )}
                    {offerModes.includes('sell') && installmentEnabled && (
                        <>
                            <BaseForm.Item
                                className="span-4"
                                name="minimum_initial_payment"
                                label="Thanh toán tối thiểu ban đầu"
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                />
                            </BaseForm.Item>
                            <BaseForm.Item
                                className="span-4"
                                name="max_installment_count"
                                label="Số kỳ tối đa"
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    min={2}
                                    max={12}
                                    style={{ width: '100%' }}
                                />
                            </BaseForm.Item>
                            <BaseForm.Item
                                className="span-4"
                                name="installment_interval_unit"
                                label="Chu kỳ trả góp"
                            >
                                <Select
                                    options={[
                                        { value: 'day', label: 'Ngày' },
                                        { value: 'week', label: 'Tuần' },
                                        { value: 'month', label: 'Tháng' },
                                    ]}
                                />
                            </BaseForm.Item>
                        </>
                    )}
                    {offerModes.includes('rent') && (
                        <>
                            <BaseForm.Item
                                className="span-4"
                                name="rental_price"
                                label="Giá thuê"
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                />
                            </BaseForm.Item>
                            <BaseForm.Item
                                className="span-4"
                                name="rental_price_unit"
                                label="Đơn vị thuê"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={[
                                        { value: 'hour', label: 'Giờ' },
                                        { value: 'day', label: 'Ngày' },
                                        { value: 'week', label: 'Tuần' },
                                        { value: 'month', label: 'Tháng' },
                                    ]}
                                />
                            </BaseForm.Item>
                            <BaseForm.Item
                                className="span-4"
                                name="rental_deposit_amount"
                                label="Tiền cọc thuê"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                />
                            </BaseForm.Item>
                        </>
                    )}
                    <BaseForm.Item
                        className="span-12"
                        name="image_url"
                        label="Ảnh đại diện"
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item
                        className="span-12"
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={5} />
                    </BaseForm.Item>
                </div>
                <BaseFormFooter
                    cancelText="Hủy"
                    loading={loading}
                    onCancel={() => navigate('/products')}
                    submitText="Lưu sản phẩm"
                />
            </BaseForm>
        </BaseFormPage>
    )
}
