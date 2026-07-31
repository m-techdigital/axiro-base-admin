import { useMemo, useState } from 'react'
import { useAsyncAction } from './useAsyncAction'

export function usePageHeaderActions({ actions = [], context = {} } = {}) {
    const [activeActionKey, setActiveActionKey] = useState(null)
    const { loading, run } = useAsyncAction()
    const visibleActions = useMemo(
        () =>
            actions.filter(
                (item) =>
                    !(typeof item.hidden === 'function'
                        ? item.hidden(context)
                        : item.hidden),
            ),
        [actions, context],
    )
    const activeAction = visibleActions.find(
        (item) => item.key === activeActionKey,
    )
    const openAction = (action) =>
        action.form ? setActiveActionKey(action.key) : action.onClick?.(context)
    const closeAction = () => setActiveActionKey(null)
    const submitForm = async (values) => {
        if (!activeAction) return null
        const form = activeAction.form || {}
        return run(
            async () => {
                const payload = form.normalize
                    ? form.normalize(values, context)
                    : values
                if (form.call) return form.call(payload, context)
                const service =
                    form.service || activeAction.service || context.service
                return service?.[
                    form.method || activeAction.method || 'create'
                ]?.(payload)
            },
            {
                successMessage: form.successMessage || 'Đã lưu dữ liệu',
                onSuccess: async (response) => {
                    closeAction()
                    await form.onSuccess?.(response, context)
                },
            },
        )
    }
    return {
        visibleActions,
        activeAction,
        activeForm: activeAction?.form,
        loading,
        openAction,
        closeAction,
        submitForm,
    }
}
