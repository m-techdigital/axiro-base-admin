import {
    BaseButton,
    BaseConfirmActionButton,
    BaseForm,
    BaseStatusSummaryBar,
    BasePageHeader,
    BaseTable,
    BaseTabs,
} from '@/components/base'
import { CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { Card, Col, Image, Row, Space, Tag, Typography, message } from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { paymentConfigFields, QR_TEMPLATE_OPTIONS } from '../formConfig'
import service from '../service'

const { Text } = Typography

export default function PaymentSettings() {
    const [form] = BaseForm.useForm()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [preview, setPreview] = useState(null)
    const [current, setCurrent] = useState(null)
    const [history, setHistory] = useState([])
    const [historyLoading, setHistoryLoading] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const data = await service.show()
            setCurrent(data)
            form.setFieldsValue(data)
        } catch (error) {
            message.error(
                error.message || 'Không thể tải cấu hình nhận thanh toán.',
            )
        } finally {
            setLoading(false)
        }
    }, [form])

    const loadHistory = useCallback(async () => {
        setHistoryLoading(true)
        try {
            const rows = await service.history()
            setHistory(Array.isArray(rows) ? rows : rows?.data || [])
        } catch (error) {
            message.error(error.message || 'Không thể tải lịch sử cấu hình.')
        } finally {
            setHistoryLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
        loadHistory()
    }, [load, loadHistory])

    const save = async (values) => {
        setSaving(true)
        try {
            await service.update(values)
            message.success('Đã cập nhật thông tin nhận thanh toán.')
            setPreview(null)
            await Promise.all([load(), loadHistory()])
        } catch (error) {
            message.error(error.message || 'Không thể cập nhật cấu hình.')
        } finally {
            setSaving(false)
        }
    }

    const showPreview = async () => {
        try {
            await form.validateFields()
            setPreview(
                await service.preview({
                    amount: 200000,
                    reference: 'XEMTRUOC-QR',
                }),
            )
        } catch (error) {
            if (!error?.errorFields) {
                message.error(error.message || 'Không thể tạo mã QR xem trước.')
            }
        }
    }

    const restore = useCallback(
        async (id) => {
            try {
                await service.activate(id)
                message.success('Đã khôi phục cấu hình nhận thanh toán.')
                setPreview(null)
                await Promise.all([load(), loadHistory()])
            } catch (error) {
                message.error(error.message || 'Không thể khôi phục cấu hình.')
            }
        },
        [load, loadHistory],
    )

    const historyColumns = useMemo(
        () => [
            {
                title: 'Trạng thái',
                dataIndex: 'is_active',
                render: (value) => (
                    <Tag color={value ? 'green' : 'default'}>
                        {value ? 'Đang áp dụng' : 'Lịch sử'}
                    </Tag>
                ),
            },
            { title: 'Ngân hàng', dataIndex: 'bank_name' },
            { title: 'Số tài khoản', dataIndex: 'account_no' },
            { title: 'Chủ tài khoản', dataIndex: 'account_name' },
            {
                title: 'Mẫu QR',
                dataIndex: 'qr_template',
                render: (value) =>
                    QR_TEMPLATE_OPTIONS.find((item) => item.value === value)
                        ?.label || value,
            },
            { title: 'Tiền tố', dataIndex: 'transfer_prefix' },
            {
                title: 'Cập nhật',
                dataIndex: 'created_at',
                render: (value) =>
                    value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—',
            },
            {
                title: 'Thao tác',
                key: 'actions',
                align: 'center',
                render: (_, row) =>
                    row.is_active ? null : (
                        <BaseConfirmActionButton
                            title="Khôi phục cấu hình này?"
                            content="Cấu hình hiện tại sẽ được chuyển về lịch sử."
                            onConfirm={() => restore(row.id)}
                            icon={<CheckCircleOutlined />}
                            aria-label="Khôi phục"
                        />
                    ),
            },
        ],
        [restore],
    )

    const configTab = (
        <Row gutter={[16, 16]}>
            <Col xs={24} xl={15}>
                <Card loading={loading} title="Thông tin nhận chuyển khoản">
                    <BaseForm
                        cancelText="Xem trước mã QR"
                        fields={paymentConfigFields}
                        form={form}
                        loading={saving}
                        onCancel={showPreview}
                        onFinish={save}
                        showFooter
                        submitText="Lưu cấu hình"
                    />
                </Card>
            </Col>
            <Col xs={24} xl={9}>
                <Card title="Kiểm tra trước khi vận hành">
                    <Space
                        orientation="vertical"
                        size={16}
                        style={{ width: '100%' }}
                    >
                        {preview ? (
                            <>
                                <Image
                                    width="100%"
                                    preview={false}
                                    src={preview.qr_url}
                                />
                                <div>
                                    <Text strong>
                                        {preview.bank?.bank_name ||
                                            preview.bank?.name}
                                    </Text>
                                    <br />
                                    <Text>{preview.bank?.account_no}</Text>
                                    <br />
                                    <Text>{preview.bank?.account_name}</Text>
                                    <br />
                                    <Text type="secondary">
                                        Nội dung: {preview.transfer_content}
                                    </Text>
                                </div>
                            </>
                        ) : (
                            <Text type="secondary">
                                Bấm “Xem trước mã QR” để kiểm tra dữ liệu trước
                                khi lưu.
                            </Text>
                        )}
                    </Space>
                </Card>
            </Col>
        </Row>
    )

    return (
        <div className="page">
            <BasePageHeader
                title="Cấu hình nhận thanh toán"
                description="Quản lý tài khoản nhận tiền, mẫu QR và lịch sử thay đổi để có thể khôi phục khi cấu hình sai."
                actions={
                    <BaseButton
                        icon={<ReloadOutlined />}
                        onClick={() => Promise.all([load(), loadHistory()])}
                    >
                        Tải lại
                    </BaseButton>
                }
            />
            <BaseStatusSummaryBar
                items={[
                    {
                        key: 'active',
                        label: 'Cấu hình đang dùng',
                        value: current?.bank_name || 'Chưa thiết lập',
                        color: current ? 'green' : 'red',
                    },
                    {
                        key: 'history',
                        label: 'Số phiên bản lưu',
                        value: history.length,
                        color: 'blue',
                    },
                ]}
                description="Mỗi lần lưu tạo một phiên bản mới; phiên bản cũ vẫn được giữ để khôi phục khi cần."
            />
            <BaseTabs
                defaultTab="configuration"
                items={[
                    {
                        key: 'configuration',
                        label: 'Cấu hình hiện tại',
                        children: configTab,
                    },
                    {
                        key: 'history',
                        label: 'Lịch sử thay đổi',
                        children: (
                            <BaseTable
                                rowKey="id"
                                loading={historyLoading}
                                dataSource={history}
                                columns={historyColumns}
                                pagination={false}
                            />
                        ),
                    },
                ]}
            />
        </div>
    )
}
