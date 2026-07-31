import { BaseModal, BaseForm } from '@/components/base'
import { Button, Input, Select, Space, Tag, message } from 'antd'
import { useState } from 'react'
import BaseTable from '../../../components/base/BaseTable'
import PageHeader from '../../../components/base/PageHeader'
import { useList } from '../../../hooks/useList'
import service, { documentTypes } from '../service'
const typeLabel = Object.fromEntries(documentTypes)
const empty = {
    code: '',
    name: '',
    type: 'sale_contract',
    target_module: 'transactions',
    status: 'approved',
    content_html: '',
    description: '',
}
export default function DocumentTemplateList() {
    const list = useList(service.list)
    const [open, setOpen] = useState(false),
        [editing, setEditing] = useState(null),
        [saving, setSaving] = useState(false)
    const [form] = BaseForm.useForm()
    const edit = (row = null) => {
        setEditing(row)
        form.setFieldsValue(row || empty)
        setOpen(true)
    }
    const save = async () => {
        const values = await form.validateFields()
        setSaving(true)
        try {
            editing
                ? await service.update(editing.id, values)
                : await service.create(values)
            message.success('Đã lưu mẫu tài liệu')
            setOpen(false)
            list.reload()
        } finally {
            setSaving(false)
        }
    }
    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tên mẫu', dataIndex: 'name' },
        { title: 'Loại', dataIndex: 'type', render: (v) => typeLabel[v] || v },
        { title: 'Phiên bản', dataIndex: 'version' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (v) => (
                <Tag color={v === 'approved' ? 'green' : 'gold'}>
                    {v === 'approved' ? 'Đang áp dụng' : v}
                </Tag>
            ),
        },
        {
            title: '',
            render: (_, r) => (
                <Button onClick={() => edit(r)}>Chỉnh sửa</Button>
            ),
        },
    ]
    return (
        <div className="page">
            <PageHeader
                title="Mẫu tài liệu"
                actions={
                    <Button type="primary" onClick={() => edit()}>
                        Tạo mẫu
                    </Button>
                }
            />
            <BaseTable
                columns={columns}
                data={list.data}
                loading={list.loading}
                pagination={{
                    total: list.meta.pagination?.total,
                    current: list.meta.pagination?.current_page,
                    pageSize: list.meta.pagination?.per_page,
                }}
                onChange={(p) =>
                    list.setParams((v) => ({
                        ...v,
                        page: p.current,
                        per_page: p.pageSize,
                    }))
                }
            />
            <BaseModal
                open={open}
                onCancel={() => setOpen(false)}
                onOk={save}
                confirmLoading={saving}
                width={900}
                title={editing ? 'Chỉnh sửa mẫu tài liệu' : 'Tạo mẫu tài liệu'}
                okText="Lưu"
                cancelText="Hủy"
            >
                <BaseForm form={form} layout="vertical">
                    <Space size="middle" style={{ display: 'flex' }}>
                        <BaseForm.Item
                            name="code"
                            label="Mã mẫu"
                            rules={[{ required: true }]}
                            style={{ flex: 1 }}
                        >
                            <Input disabled={!!editing} />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="name"
                            label="Tên mẫu"
                            rules={[{ required: true }]}
                            style={{ flex: 2 }}
                        >
                            <Input />
                        </BaseForm.Item>
                    </Space>
                    <Space size="middle" style={{ display: 'flex' }}>
                        <BaseForm.Item
                            name="type"
                            label="Loại tài liệu"
                            rules={[{ required: true }]}
                            style={{ flex: 1 }}
                        >
                            <Select
                                options={documentTypes.map(
                                    ([value, label]) => ({ value, label }),
                                )}
                            />
                        </BaseForm.Item>
                        <BaseForm.Item
                            name="status"
                            label="Trạng thái"
                            style={{ flex: 1 }}
                        >
                            <Select
                                options={[
                                    { value: 'draft', label: 'Bản nháp' },
                                    {
                                        value: 'approved',
                                        label: 'Đang áp dụng',
                                    },
                                    { value: 'archived', label: 'Lưu trữ' },
                                ]}
                            />
                        </BaseForm.Item>
                    </Space>
                    <BaseForm.Item name="description" label="Mô tả">
                        <Input.TextArea rows={2} />
                    </BaseForm.Item>
                    <div
                        style={{
                            marginBottom: 12,
                            padding: 12,
                            background: '#fff7e6',
                            border: '1px solid #ffd591',
                        }}
                    >
                        Mẫu đang áp dụng phải có đầy đủ thông tin các bên, đối
                        tượng, giá trị, quyền và nghĩa vụ, bảo mật, tranh chấp
                        và xác nhận điện tử. Khi sửa mẫu đã dùng, hãy tăng phiên
                        bản và phát hành lại tài liệu thay vì thay đổi bản cũ.
                    </div>
                    <BaseForm.Item
                        name="content_html"
                        label="Nội dung HTML có trường trộn {{transaction_code}}, {{buyer_name}}..."
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea
                            rows={16}
                            style={{ fontFamily: 'monospace' }}
                        />
                    </BaseForm.Item>
                </BaseForm>
            </BaseModal>
        </div>
    )
}
