import { useMemo, useState } from 'react'

import { useAsyncAction } from './useAsyncAction'

export const resolvePageHeaderConfig = (source, ...args) =>
    typeof source === 'function' ? source(...args) : source

const defaultCall = (values, action, context) => {
    const form = action.form || {}
    const method = form.method || action.method || 'create'
    const service = form.service || action.service || context.service

    return service?.[method]?.(values)
}

export function usePageHeaderActions({ actions = [], context = {} } = {}) {
    const [activeActionKey, setActiveActionKey] = useState(null)
    const { loading, run } = useAsyncAction()

    const visibleActions = useMemo(
        () =>
            actions.filter(
                (action) => !resolvePageHeaderConfig(action.hidden, context),
            ),
        [actions, context],
    )

    const activeAction = visibleActions.find(
        (action) => action.key === activeActionKey,
    )
    const activeForm = activeAction?.form

    const formContext = useMemo(
        () => ({
            ...context,
            action: activeAction,
            close: () => setActiveActionKey(null),
        }),
        [activeAction, context],
    )

    const openAction = (action) => {
        if (action.form) {
            setActiveActionKey(action.key)
            return
        }

        action.onClick?.(context)
    }

    const closeAction = () => setActiveActionKey(null)

    const submitForm = async (values) => {
        if (!activeAction) return null

        return run(
            async () => {
                const normalized = activeForm?.normalize
                    ? activeForm.normalize(values, formContext)
                    : values

                if (activeForm?.call) {
                    return activeForm.call(normalized, formContext)
                }

                return defaultCall(normalized, activeAction, formContext)
            },
            {
                successMessage:
                    activeForm?.successMessage ||
                    activeForm?.message ||
                    'Đã lưu dữ liệu',
                onSuccess: async (response) => {
                    setActiveActionKey(null)
                    await activeForm?.onSuccess?.(response, formContext)
                    await activeAction?.onSuccess?.(response, formContext)
                },
            },
        )
    }

    return {
        visibleActions,
        activeAction,
        activeForm,
        formContext,
        loading,
        openAction,
        closeAction,
        submitForm,
    }
}
