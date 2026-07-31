import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { notifyError, resolveActionProp } from '@/utils'

import { useConfirmActionRunner } from '../useConfirmActionRunner'

export function useTableAction({ onReload, onOpenForm, onOpenView } = {}) {
    const navigate = useNavigate()
    const { loading, runConfirm } = useConfirmActionRunner({ onReload })

    const handleAction = useCallback(
        async (action, record, context = {}) => {
            if (!action) {
                return
            }

            try {
                if (action.type === 'view') {
                    return onOpenView?.(record, action, context)
                }

                if (action.type === 'form') {
                    return onOpenForm?.(record, action, context)
                }

                if (action.type === 'navigate') {
                    const path = resolveActionProp(action.path, record, context)

                    if (!path) {
                        throw new Error(
                            'Đường dẫn thao tác chưa được cấu hình.',
                        )
                    }

                    return navigate(path)
                }

                if (action.type === 'confirm') {
                    return runConfirm(action, record, context)
                }

                if (typeof action.execute === 'function') {
                    const response = await action.execute(record, context)
                    await onReload?.()

                    return response
                }
            } catch (error) {
                notifyError(error)
                throw error
            }
        },
        [navigate, onOpenForm, onOpenView, onReload, runConfirm],
    )

    return { handleAction, loading }
}
