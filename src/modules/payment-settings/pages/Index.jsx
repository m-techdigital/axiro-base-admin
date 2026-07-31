import { BaseForm } from '@/components/base'
import {
    Button,
    Card,
    Col,
    Image,
    Input,
    Row,
    Select,
    Space,
    message,
} from 'antd'
import { useCallback, useEffect, useState } from 'react'
import PageHeader from '../../../components/base/PageHeader'
import service from '../service'

export default function PaymentSettings() {
    const [form] = BaseForm.useForm()
    const [loading, setLoading] = useState(true)
    const [preview, setPreview] = useState(null)
    const load = useCallback(async () => {
        setLoading(true)
        try {
            form.setFieldsValue(await service.show())
        } catch (e) {
            message.error(
                e.message || 'Không thể tải cấu hình nhận thanh toán.',
            )
        } finally {
            setLoading(false)
        }
    }, [form])
    useEffect(() => {
        load()
    }, [load])
    const save = async (values) => {
        try {
            await service.update(values)
            message.success('Đã cập nhật thông tin nhận thanh toán.')
            await load()
        } catch (e) {
            message.error(e.message || 'Không thể cập nhật cấu hình.')
        }
    }
    const showPreview = async () => {
        try {
            const values = await form.validateFields()
            setPreview(
                await service.preview({
                    amount: 200000,
                    reference: 'XEMTRUOC-QR',
                }),
            )
            form.setFieldsValue(values)
        } catch (e) {
            if (e?.errorFields) return
            message.error(e.message || 'Không thể tạo mã QR xem trước.')
        }
    }
    return (
        <div className="page">
            <PageHeader title="Cấu hình nhận thanh toán" />
            <Row gutter={16}>
                <Col xs={24} lg={14}>
                    <Card loading={loading}>
                        <BaseForm form={form} layout="vertical" onFinish={save}>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <BaseForm.Item
                                        name="bank_id"
                                        label="Mã ngân hàng"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="Ví dụ: MB" />
                                    </BaseForm.Item>
                                </Col>
                                <Col span={12}>
                                    <BaseForm.Item
                                        name="bank_name"
                                        label="Tên ngân hàng"
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </BaseForm.Item>
                                </Col>
                            </Row>
                            <BaseForm.Item
                                name="account_no"
                                label="Số tài khoản"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </BaseForm.Item>
                            <BaseForm.Item
                                name="account_name"
                                label="Tên chủ tài khoản"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </BaseForm.Item>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <BaseForm.Item
                                        name="qr_template"
                                        label="Mẫu mã QR"
                                        rules={[{ required: true }]}
                                    >
                                        <Select
                                            options={[
                                                {
                                                    value: 'compact2',
                                                    label: 'Gọn có thông tin',
                                                },
                                                {
                                                    value: 'compact',
                                                    label: 'Gọn',
                                                },
                                                {
                                                    value: 'qr_only',
                                                    label: 'Chỉ mã QR',
                                                },
                                                {
                                                    value: 'print',
                                                    label: 'Bản in',
                                                },
                                            ]}
                                        />
                                    </BaseForm.Item>
                                </Col>
                                <Col span={12}>
                                    <BaseForm.Item
                                        name="transfer_prefix"
                                        label="Tiền tố nội dung"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="MBN" />
                                    </BaseForm.Item>
                                </Col>
                            </Row>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Lưu cấu hình
                                </Button>
                                <Button onClick={showPreview}>
                                    Xem trước mã QR
                                </Button>
                            </Space>
                        </BaseForm>
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card title="Mã QR xem trước">
                        {preview ? (
                            <Space
                                direction="vertical"
                                style={{ width: '100%' }}
                            >
                                <Image width={280} src={preview.qr_url} />
                                <div>
                                    <b>
                                        {preview.bank?.bank_name ||
                                            preview.bank?.name}
                                    </b>
                                    <br />
                                    {preview.bank?.account_no}
                                    <br />
                                    {preview.bank?.account_name}
                                    <br />
                                    Nội dung: {preview.transfer_content}
                                </div>
                            </Space>
                        ) : (
                            <p>
                                Lưu cấu hình hoặc bấm xem trước để kiểm tra mã
                                QR.
                            </p>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
