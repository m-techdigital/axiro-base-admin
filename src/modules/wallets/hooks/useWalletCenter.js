import { BaseModal } from '@/components/base'
import { message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createWalletColumns } from '../components/walletColumns'
import service from '../service'

export const useWalletCenter = () => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [ledger, setLedger] = useState(null)
    const [drawer, setDrawer] = useState(false)
    const [filters, setFilters] = useState({ keyword: '' })

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response = await service.list({
                keyword: filters.keyword,
                per_page: 100,
            })
            setRows(response.data?.data?.data || response.data?.data || [])
        } finally {
            setLoading(false)
        }
    }, [filters.keyword])

    useEffect(() => {
        load()
    }, [load])

    const open = useCallback(async (row) => {
        setSelected(row)
        setDrawer(true)
        const response = await service.detail(row.id, { per_page: 100 })
        setLedger(response.data?.data || response.data)
    }, [])

    const refreshDetail = useCallback(async () => {
        if (!selected) return
        const response = await service.detail(selected.id, { per_page: 100 })
        setLedger(response.data?.data || response.data)
    }, [selected])

    const submitAdjustment = useCallback(
        async (payload) => {
            await service.adjust(selected.id, payload)
            message.success(
                'Đã ghi nhận điều chỉnh có nhật ký số dư trước/sau.',
            )
            await refreshDetail()
            await load()
            BaseModal.destroyAll()
        },
        [load, refreshDetail, selected],
    )

    const columns = useMemo(() => createWalletColumns(open), [open])

    return {
        rows,
        loading,
        selected,
        ledger,
        drawer,
        filters,
        setFilters,
        setDrawer,
        load,
        columns,
        submitAdjustment,
    }
}
