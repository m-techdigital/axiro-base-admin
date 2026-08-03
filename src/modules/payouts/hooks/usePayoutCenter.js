import { message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPayoutColumns } from '../components/payoutColumns'
import service from '../service'

const extract = (response) => response?.data?.data || response?.data || []

export const usePayoutCenter = () => {
    const [active, setActive] = useState('withdrawals')
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [note, setNote] = useState('')
    const [reference, setReference] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response =
                active === 'verifications'
                    ? await service.verifications()
                    : active === 'accounts'
                      ? await service.accounts()
                      : await service.withdrawals()
            setRows(extract(response))
        } catch (error) {
            message.error(error.message)
        } finally {
            setLoading(false)
        }
    }, [active])

    useEffect(() => {
        load()
    }, [load])

    const close = useCallback(() => {
        setSelected(null)
        setNote('')
        setReference('')
    }, [])

    const act = useCallback(
        async (action) => {
            try {
                await action()
                message.success('Đã cập nhật')
                close()
                await load()
            } catch (error) {
                message.error(error.message)
            }
        },
        [close, load],
    )

    const columns = useMemo(
        () => createPayoutColumns(active, setSelected),
        [active],
    )

    return {
        active,
        setActive,
        rows,
        loading,
        selected,
        setSelected,
        note,
        setNote,
        reference,
        setReference,
        columns,
        act,
        close,
    }
}
