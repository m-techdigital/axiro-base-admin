import { BaseForm, BaseModal } from '@/components/base'
import { Alert, message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import {
    createDocumentTemplateFields,
    emptyDocumentTemplate,
} from '../formConfig'
import service from '../service'

export default function DocumentTemplateEditorModal({
    open,
    editing,
    documentTypes,
    onClose,
    onSaved,
}) {
    const [saving, setSaving] = useState(false)
    const [form] = BaseForm.useForm()
    const formFields = useMemo(
        () => createDocumentTemplateFields({ documentTypes, editing }),
        [documentTypes, editing],
    )

    useEffect(() => {
        if (!open) return
        form.setFieldsValue(editing || emptyDocumentTemplate)
    }, [editing, form, open])

    const save = async () => {
        const values = await form.validateFields()
        setSaving(true)
        try {
            const saved = editing
                ? await service.update(editing.id, values)
                : await service.create(values)
            message.success('Đã lưu mẫu tài liệu')
            onSaved(saved?.data || saved)
        } finally {
            setSaving(false)
        }
    }

    return (
        <BaseModal
            open={open}
            onCancel={onClose}
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
            {editing?.generated_documents_count > 0 ? (
                <Alert
                    showIcon
                    type="warning"
                    title="Mẫu đã phát sinh tài liệu là bất biến"
                    description={`Lưu thay đổi sẽ tạo phiên bản v${Number(editing.version || 1) + 1}; tài liệu cũ vẫn trỏ về v${editing.version}.`}
                    style={{ marginBottom: 16 }}
                />
            ) : null}
            {editing?.supersedes ? (
                <Alert
                    showIcon
                    type="info"
                    title={`Phiên bản này kế tiếp ${editing.supersedes.code} v${editing.supersedes.version}`}
                    style={{ marginBottom: 16 }}
                />
            ) : null}
            <BaseForm
                fields={formFields}
                form={form}
                initialValues={emptyDocumentTemplate}
                record={editing || emptyDocumentTemplate}
            />
        </BaseModal>
    )
}
