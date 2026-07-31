import { BaseModal } from '@/components/base'
import { Button, Space, Tag } from 'antd'
import { useState } from 'react'
import BaseTable from '../../../components/base/BaseTable'
import PageHeader from '../../../components/base/PageHeader'
import { useList } from '../../../hooks/useList'
import service from '../service'
const labels = {
    sale_contract: 'Hợp đồng mua bán',
    rental_contract: 'Hợp đồng thuê',
    installment_appendix: 'Phụ lục trả góp',
    deposit_confirmation: 'Xác nhận đặt cọc',
    payment_confirmation: 'Xác nhận thanh toán',
    handover_minutes: 'Biên bản bàn giao',
    return_minutes: 'Biên bản hoàn trả',
    dispute_minutes: 'Biên bản tranh chấp',
}
export default function GeneratedDocumentList() {
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
            render: (v) => labels[v] || v,
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
            title: '',
            render: (_, r) => (
                <Space>
                    <Button onClick={() => show(r.id)}>Xem</Button>
                    <Button type="primary" onClick={() => download(r)}>
                        Tải PDF
                    </Button>
                </Space>
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
