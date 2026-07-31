import { BaseTable, BaseModal, BaseForm } from '@/components/base'
import {
    Button,
    Card,
    Checkbox,
    Input,
    Select,
    Space,
    Tabs,
    Tag,
    message,
} from 'antd'
import { useEffect, useState } from 'react'
import PageHeader from '../../../components/base/PageHeader'
import service from '../service'
const unwrap = (response) => response?.data?.data || response?.data || {}
const rowsOf = (response) => {
    const payload = unwrap(response)
    return Array.isArray(payload) ? payload : payload?.data || []
}
export default function MarketplaceTrustPage() {
    const [tab, setTab] = useState('reviews'),
        [rows, setRows] = useState([]),
        [loading, setLoading] = useState(false),
        [selected, setSelected] = useState(null),
        [contentOpen, setContentOpen] = useState(false)
    const [form] = BaseForm.useForm()
    const load = async () => {
        setLoading(true)
        try {
            const response =
                tab === 'content'
                    ? await service.contents()
                    : tab === 'risks'
                      ? await service.risks()
                      : await service.reviews()
            setRows(rowsOf(response))
        } catch (error) {
            message.error(error.message || 'Không thể tải dữ liệu.')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        load()
    }, [tab])
    const reviewColumns = [
        { title: 'Giao dịch', render: (_, r) => r.transaction?.code },
        { title: 'Người đánh giá', render: (_, r) => r.reviewer?.name },
        { title: 'Đối tượng', render: (_, r) => r.reviewee?.name },
        { title: 'Điểm', dataIndex: 'rating', render: (v) => `${v}/5` },
        { title: 'Nhận xét', dataIndex: 'comment', ellipsis: true },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v) => <Tag>{v}</Tag>,
        },
        {
            title: '',
            render: (_, r) => (
                <Button type="link" onClick={() => setSelected(r)}>
                    Kiểm duyệt
                </Button>
            ),
        },
    ]
    const contentColumns = [
        { title: 'Loại', dataIndex: 'type', render: (v) => <Tag>{v}</Tag> },
        { title: 'Tiêu đề', dataIndex: 'title' },
        { title: 'Slug', dataIndex: 'slug' },
        { title: 'Phiên bản', dataIndex: 'version' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v) => <Tag>{v}</Tag>,
        },
        { title: 'Ngày hiệu lực', dataIndex: 'effective_at' },
        {
            title: '',
            render: (_, r) => (
                <Button
                    type="link"
                    onClick={() => {
                        form.setFieldsValue(r)
                        setContentOpen(true)
                    }}
                >
                    Sửa
                </Button>
            ),
        },
    ]
    const riskColumns = [
        { title: 'Mã', dataIndex: 'code' },
        {
            title: 'Đối tượng',
            render: (_, r) => `${r.subject_type} #${r.subject_id}`,
        },
        { title: 'Rule', dataIndex: 'rule_code' },
        {
            title: 'Mức',
            dataIndex: 'level',
            render: (v) => (
                <Tag
                    color={
                        v === 'high' || v === 'critical'
                            ? 'red'
                            : v === 'medium'
                              ? 'orange'
                              : undefined
                    }
                >
                    {v}
                </Tag>
            ),
        },
        { title: 'Lý do', dataIndex: 'reason', ellipsis: true },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v) => <Tag>{v}</Tag>,
        },
        {
            title: '',
            render: (_, r) => (
                <Button type="link" onClick={() => setSelected(r)}>
                    Xử lý
                </Button>
            ),
        },
    ]
    const saveContent = async (values) => {
        try {
            if (values.id) await service.updateContent(values.id, values)
            else await service.createContent(values)
            message.success('Đã lưu nội dung.')
            setContentOpen(false)
            form.resetFields()
            load()
        } catch (error) {
            message.error(error.message || 'Không thể lưu nội dung.')
        }
    }
    const handleSelected = async (values) => {
        try {
            if (tab === 'reviews')
                await service.moderateReview(selected.id, {
                    status: values.status,
                    note: values.note,
                })
            else
                await service.resolveRisk(selected.id, {
                    status: values.status,
                    resolution: values.note,
                })
            message.success('Đã cập nhật.')
            setSelected(null)
            load()
        } catch (error) {
            message.error(error.message || 'Không thể cập nhật.')
        }
    }
    return (
        <div className="page">
            <PageHeader
                title="Niềm tin, nội dung và rủi ro"
                subtitle="Kiểm duyệt đánh giá, phát hành nội dung và xử lý cảnh báo rủi ro."
            />
            <Card>
                <Tabs
                    activeKey={tab}
                    onChange={setTab}
                    tabBarExtraContent={
                        tab === 'content' ? (
                            <Button
                                type="primary"
                                onClick={() => {
                                    form.resetFields()
                                    form.setFieldsValue({
                                        type: 'guide',
                                        status: 'draft',
                                        requires_acceptance: false,
                                    })
                                    setContentOpen(true)
                                }}
                            >
                                Thêm nội dung
                            </Button>
                        ) : null
                    }
                    items={[
                        { key: 'reviews', label: 'Đánh giá' },
                        { key: 'content', label: 'Nội dung' },
                        { key: 'risks', label: 'Rủi ro' },
                    ]}
                />
                <BaseTable
                    rowKey="id"
                    loading={loading}
                    dataSource={rows}
                    columns={
                        tab === 'content'
                            ? contentColumns
                            : tab === 'risks'
                              ? riskColumns
                              : reviewColumns
                    }
                    scroll={{ x: 1000 }}
                />
            </Card>
            <BaseModal
                open={contentOpen}
                onCancel={() => setContentOpen(false)}
                footer={null}
                title="Nội dung Marketplace"
                width={820}
                destroyOnClose
            >
                <BaseForm form={form} layout="vertical" onFinish={saveContent}>
                    <BaseForm.Item name="id" hidden>
                        <Input />
                    </BaseForm.Item>
                    <Space align="start" wrap>
                        <BaseForm.Item
                            name="type"
                            label="Loại"
                            rules={[{ required: true }]}
                        >
                            <Select
                                style={{ width: 160 }}
                                options={[
                                    'topic',
                                    'guide',
                                    'policy',
                                    'announcement',
                                    'faq',
                                ].map((value) => ({ value, label: value }))}
                            />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true }]}
                        >
                            <Select
                                style={{ width: 160 }}
                                options={['draft', 'published', 'archived'].map(
                                    (value) => ({ value, label: value }),
                                )}
                            />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="slug"
                            label="Slug"
                            rules={[{ required: true }]}
                        >
                            <Input style={{ width: 260 }} />
                        </BaseForm.Item>
                    </Space>
                    <BaseForm.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </BaseForm.Item>
                    <BaseForm.Item name="summary" label="Tóm tắt">
                        <Input.TextArea rows={2} />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="body"
                        label="Nội dung"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea rows={12} />
                    </BaseForm.Item>
                    <Space>
                        <BaseForm.Item
                            name="requires_acceptance"
                            valuePropName="checked"
                        >
                            <Checkbox>Yêu cầu khách hàng xác nhận</Checkbox>
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="effective_at"
                            label="Ngày hiệu lực"
                        >
                            <Input type="datetime-local" />
                        </BaseForm.Item>
                    </Space>
                    <Button type="primary" htmlType="submit">
                        Lưu nội dung
                    </Button>
                </BaseForm>
            </BaseModal>
            <BaseModal
                open={!!selected}
                onCancel={() => setSelected(null)}
                footer={null}
                title={
                    tab === 'reviews'
                        ? 'Kiểm duyệt đánh giá'
                        : 'Xử lý cảnh báo rủi ro'
                }
            >
                <BaseForm
                    layout="vertical"
                    onFinish={handleSelected}
                    initialValues={{
                        status:
                            tab === 'reviews'
                                ? selected?.status || 'published'
                                : 'reviewing',
                    }}
                    key={`${tab}-${selected?.id}`}
                >
                    <BaseForm.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={(tab === 'reviews'
                                ? ['published', 'hidden']
                                : ['reviewing', 'resolved', 'dismissed']
                            ).map((value) => ({ value, label: value }))}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item
                        name="note"
                        label={
                            tab === 'reviews'
                                ? 'Ghi chú kiểm duyệt'
                                : 'Kết quả xử lý'
                        }
                        rules={tab === 'risks' ? [{ required: true }] : []}
                    >
                        <Input.TextArea rows={5} />
                    </BaseForm.Item>
                    <Button type="primary" htmlType="submit">
                        Cập nhật
                    </Button>
                </BaseForm>
            </BaseModal>
        </div>
    )
}
