import { BaseActionGroup, BaseIconAction, BaseModal } from '@/components/base'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import {
    loadMarketplaceOptions,
    optionMap,
} from '@/services/marketplaceOptions'
import BaseTable from '../../../components/base/BaseTable'
import PageHeader from '../../../components/base/PageHeader'
import { useList } from '../../../hooks/useList'
import service from '../service'
export default function GeneratedDocumentList() {
    const [documentTypes, setDocumentTypes] = useState([])
    const documentLabels = useMemo(
        () => optionMap(documentTypes),
        [documentTypes],
    )
    useEffect(() => {
        loadMarketplaceOptions().then((options) =>
            setDocumentTypes(options.document_types || []),
        )
    }, [])
    const list = useList(service.list),
        [preview, setPreview] = useState(null)
    const show = async (id) => setPreview((await service.preview(id)).data)
    const download = async (row) => {
        const blob = await service.download(row.id)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${row.code}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    }
    const cols = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tài liệu', dataIndex: 'title' },
        { title: 'Giao dịch', render: (_, r) => r.transaction?.code },
        {
            title: 'Loại',
            dataIndex: 'document_type',
            render: (v) => documentLabels[v] || v,
        },
        { title: 'Phiên bản', dataIndex: 'version' },
        {
            title: 'Xác nhận',
            render: (_, r) => (
                <Tag
                    color={(r.acceptances || []).length >= 2 ? 'green' : 'gold'}
                >
                    {(r.acceptances || []).length}/2 bên
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, r) => (
                <BaseActionGroup>
                    <BaseIconAction
                        icon={<EyeOutlined />}
                        label="Xem tài liệu"
                        onClick={() => show(r.id)}
                    />
                    <BaseIconAction
                        icon={<DownloadOutlined />}
                        label="Tải PDF"
                        onClick={() => download(r)}
                    />
                </BaseActionGroup>
            ),
        },
    ]
    return (
        <div className="page">
            <PageHeader title="Tài liệu đã phát hành" />
            <BaseTable
                columns={cols}
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
                open={!!preview}
                onCancel={() => setPreview(null)}
                footer={null}
                width={900}
                title={preview?.title}
            >
                <div
                    className="document-preview"
                    dangerouslySetInnerHTML={{ __html: preview?.html || '' }}
                />
            </BaseModal>
        </div>
    )
}
