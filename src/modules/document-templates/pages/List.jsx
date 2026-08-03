import { BaseForm, BaseModal, BaseButton } from '@/components/base'
import { PlusOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import BaseTable from '../../../components/base/BaseTable'
import PageHeader from '../../../components/base/PageHeader'
import { useList } from '../../../hooks/useList'
import service from '../service'
import {
    loadMarketplaceOptions,
    optionMap,
} from '@/services/marketplaceOptions'
import {
    createDocumentTemplateFields,
    emptyDocumentTemplate,
} from '../formConfig'
import { createDocumentTemplateColumns } from '../columns'

export default function DocumentTemplateList() {
    const list = useList(service.list)
    const [documentTypes, setDocumentTypes] = useState([])
    const typeLabel = useMemo(() => optionMap(documentTypes), [documentTypes])
    useEffect(() => {
        loadMarketplaceOptions().then((options) =>
            setDocumentTypes(options.document_types || []),
        )
    }, [])
    const [open, setOpen] = useState(false),
        [editing, setEditing] = useState(null),
        [saving, setSaving] = useState(false)
    const [form] = BaseForm.useForm()
    const formFields = useMemo(
        () => createDocumentTemplateFields({ documentTypes, editing }),
        [documentTypes, editing],
    )
    const edit = (row = null) => {
        setEditing(row)
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
    const columns = useMemo(
        () => createDocumentTemplateColumns({ onEdit: edit, typeLabel }),
        [typeLabel],
    )
    return (
        <div className="page">
            <PageHeader
                title="Mẫu tài liệu"
                actions={
                    <BaseButton
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => edit()}
                    >
                        Tạo mẫu
                    </BaseButton>
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
                title={
                    editing
                        ? editing.generated_documents_count > 0
                            ? `Tạo phiên bản mới từ v${editing.version}`
                            : 'Chỉnh sửa mẫu tài liệu'
                        : 'Tạo mẫu tài liệu'
                }
                okText="Lưu"
                cancelText="Hủy"
            >
                <BaseForm
                    fields={formFields}
                    form={form}
                    initialValues={emptyDocumentTemplate}
                    record={editing || emptyDocumentTemplate}
                />
            </BaseModal>
        </div>
    )
}
