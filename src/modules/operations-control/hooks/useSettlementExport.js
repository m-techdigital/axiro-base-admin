import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'

import service from '../service'

const unwrap = (response) => response?.data?.data || response?.data || {}

export default function useSettlementExport() {
    const [request, setRequest] = useState(null)

    useEffect(() => {
        if (!request?.id || !['pending', 'processing'].includes(request.status))
            return undefined

        let active = true
        let inFlight = false
        const poll = async () => {
            if (inFlight) return
            inFlight = true
            try {
                const current = unwrap(
                    await service.rentalSettlementExportStatus(request.id),
                )
                if (!active) return
                setRequest(current)
                if (current.status === 'completed') {
                    message.success(
                        `Đã tạo tệp xuất ${current.row_count || 0} dòng.`,
                    )
                } else if (current.status === 'failed') {
                    message.error(
                        current.error_message || 'Tạo tệp xuất thất bại.',
                    )
                }
            } catch (error) {
                if (active)
                    message.error(
                        error.message ||
                            'Không thể kiểm tra tiến độ xuất dữ liệu.',
                    )
            } finally {
                inFlight = false
            }
        }

        const timer = window.setInterval(poll, 3000)
        return () => {
            active = false
            window.clearInterval(timer)
        }
    }, [request?.id, request?.status])

    const create = useCallback(async (params) => {
        const response = await service.requestRentalSettlementExport(params)
        setRequest(unwrap(response))
        message.success('Đã đưa yêu cầu xuất dữ liệu vào hàng đợi.')
    }, [])

    const download = useCallback(() => {
        if (request?.id) service.downloadRentalSettlementExport(request.id)
    }, [request?.id])

    return { request, create, download }
}
