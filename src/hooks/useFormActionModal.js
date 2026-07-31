import { useCallback, useState } from 'react'
import { message } from 'antd'

export function useFormActionModal({ onSuccess } = {}) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const openModal = useCallback(() => setOpen(true), [])
    const closeModal = useCallback(() => setOpen(false), [])
    const submitAction = useCallback(
        async (action, values, options = {}) => {
            setLoading(true)
            try {
                const response = await action(values)
                if (options.successMessage)
                    message.success(options.successMessage)
                closeModal()
                await options.afterSuccess?.(response, values)
                await onSuccess?.(response, values)
                return response
            } finally {
                setLoading(false)
            }
        },
        [closeModal, onSuccess],
    )
    return { open, loading, openModal, closeModal, submitAction, setOpen }
}
