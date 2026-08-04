import { BasePageHeader, BaseButton, BaseTable } from '@/components/base'
import { PlusOutlined } from '@ant-design/icons'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useList } from '../../../hooks/useList'
import {
    loadMarketplaceOptions,
    optionMap,
} from '@/services/marketplaceOptions'
import { createDocumentTemplateColumns } from '../columns'
import service from '../service'

const DocumentTemplateEditorModal = lazy(
    () => import('../components/DocumentTemplateEditorModal'),
)

export default function DocumentTemplateList() {
    const list = useList(service, { per_page: 100 })
    const [documentTypes, setDocumentTypes] = useState([])
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const typeLabel = useMemo(() => optionMap(documentTypes), [documentTypes])

    useEffect(() => {
        loadMarketplaceOptions().then((options) =>
            setDocumentTypes(options.document_types || []),
        )
    }, [])

    const edit = (row = null) => {
        setEditing(row)
        setOpen(true)
    }
    const close = () => {
        setOpen(false)
        setEditing(null)
    }
    const columns = useMemo(
        () => createDocumentTemplateColumns({ onEdit: edit, typeLabel }),
        [typeLabel],
    )

    return (
        <div className="page">
            <BasePageHeader
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
                onChange={(pagination) =>
                    list.setParams((value) => ({
                        ...value,
                        page: pagination.current,
                        per_page: pagination.pageSize,
                    }))
                }
            />
            {open ? (
                <Suspense fallback={null}>
                    <DocumentTemplateEditorModal
                        open
                        editing={editing}
                        documentTypes={documentTypes}
                        onClose={close}
                        onSaved={() => {
                            close()
                            list.reload()
                        }}
                    />
                </Suspense>
            ) : null}
        </div>
    )
}
