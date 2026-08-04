import { useBaseFilters, useList } from '@/hooks'
import { message } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { createNotificationColumns } from '../components/notificationColumns'
import service from '../service'

export const useNotificationCenter = () => {
    const navigate = useNavigate()
    const [detail, setDetail] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [handlingNote, setHandlingNote] = useState('')
    const list = useList(service, { page: 1, per_page: 20 })
    const filters = useBaseFilters({
        defaultParams: { page: 1, per_page: 20 },
        onSearch: list.setParams,
        onReset: list.setParams,
    })

    const read = useCallback(
        async (record) => {
            try {
                await service.read(record.id)
                await list.reload()
            } catch (error) {
                message.error(error.message)
            }
        },
        [list],
    )

    const showDetail = useCallback(
        async (record) => {
            setDetailLoading(true)
            try {
                const response = await service.show(record.id)
                setDetail(response?.data || response)
                setHandlingNote('')
                if (!record.read_at) {
                    await service.read(record.id)
                    await list.reload()
                }
            } catch (error) {
                message.error(
                    error.message || 'Không thể tải chi tiết thông báo.',
                )
            } finally {
                setDetailLoading(false)
            }
        },
        [list],
    )

    const handle = useCallback(async () => {
        try {
            await service.handle(detail.id, handlingNote.trim())
            message.success('Đã đánh dấu thông báo đã xử lý.')
            setDetail((current) => ({
                ...current,
                handled_at: new Date().toISOString(),
                handling_note: handlingNote.trim(),
            }))
            await list.reload()
        } catch (error) {
            message.error(
                error.message || 'Không thể hoàn tất xử lý thông báo.',
            )
        }
    }, [detail, handlingNote, list])

    const columns = useMemo(
        () =>
            createNotificationColumns({
                onRead: read,
                onShow: showDetail,
                onNavigate: navigate,
            }),
        [navigate, read, showDetail],
    )

    return {
        list,
        filters,
        columns,
        detail,
        detailLoading,
        handlingNote,
        setHandlingNote,
        setDetail,
        handle,
        navigate,
    }
}
