import { DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import {
    BaseActionGroup,
    BaseIconAction,
    BaseListView,
    BaseModal,
} from '@/components/base'
import { valueLabel } from '@/contracts/marketplaceLabels'
import { useList } from '@/hooks/useList'
import {
    loadMarketplaceOptions,
    optionMap,
} from '@/services/marketplaceOptions'

import service from '../service'

export default function GeneratedDocumentList() {
    const [documentTypes, setDocumentTypes] = useState([])
    const [preview, setPreview] = useState(null)
    const list = useList(service.list)
    const documentLabels = useMemo(
        () => optionMap(documentTypes),
        [documentTypes],
    )

    useEffect(() => {
        loadMarketplaceOptions().then((options) =>
            setDocumentTypes(options.document_types || []),
        )
    }, [])

    const show = async (id) => setPreview((await service.preview(id)).data)

    const download = async (row) => {
        const blob = await service.download(row.id)
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `${row.code}.pdf`
        anchor.click()
        URL.revokeObjectURL(url)
    }

    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tài liệu', dataIndex: 'title' },
        { title: 'Giao dịch', render: (_, row) => row.transaction?.code },
        {
            title: 'Loại',
            dataIndex: 'document_type',
            render: (value) => documentLabels[value] || valueLabel(value),
        },
        { title: 'Phiên bản', dataIndex: 'version' },
        {
            title: 'Xác nhận',
            render: (_, row) => (
                <Tag
                    color={
                        (row.acceptances || []).length >= 2 ? 'green' : 'gold'
                    }
                >
                    {(row.acceptances || []).length}/2 bên
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, row) => (
                <BaseActionGroup>
                    <BaseIconAction
                        icon={<EyeOutlined />}
                        label="Xem tài liệu"
                        onClick={() => show(row.id)}
                    />
                    <BaseIconAction
                        icon={<DownloadOutlined />}
                        label="Tải PDF"
                        onClick={() => download(row)}
                    />
                </BaseActionGroup>
            ),
        },
    ]

    return (
        <>
            <BaseListView
                columns={columns}
                data={list.data}
                description="Tra cứu tài liệu đã phát hành theo giao dịch, phiên bản và trạng thái xác nhận của các bên."
                loading={list.loading}
                onChange={(pagination) =>
                    list.setParams((current) => ({
                        ...current,
                        page: pagination.current,
                        per_page: pagination.pageSize,
                    }))
                }
                pagination={{
                    total: list.meta.pagination?.total,
                    current: list.meta.pagination?.current_page,
                    pageSize: list.meta.pagination?.per_page,
                    showSizeChanger: true,
                }}
                scroll={{ x: 'max-content' }}
                title="Tài liệu đã phát hành"
            />
            <BaseModal
                footer={null}
                onCancel={() => setPreview(null)}
                open={Boolean(preview)}
                title={preview?.title}
                width={900}
            >
                <div
                    className="document-preview"
                    dangerouslySetInnerHTML={{ __html: preview?.html || '' }}
                />
            </BaseModal>
        </>
    )
}
