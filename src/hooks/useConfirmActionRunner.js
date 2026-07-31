import { useCallback } from 'react'
import { Modal } from 'antd'

import { resolveActionProp } from '@/utils'

import { useAsyncAction } from './useAsyncAction'

export function useConfirmActionRunner(defaultContext = {}) {
    const { loading, run } = useAsyncAction()

    const runConfirm = useCallback(
        (action, record = null, contextPatch = {}) => {
            const context = { ...defaultContext, ...contextPatch }
            const source = action?.source ?? {}

            Modal.confirm({
                title: resolveActionProp(
                    source.title ?? action?.title,
                    record,
                    context,
                ),
                content: resolveActionProp(
                    source.content ?? action?.content,
                    record,
                    context,
                ),
                okText:
                    resolveActionProp(source.okText, record, context) ??
                    'Xác nhận',
                cancelText:
                    resolveActionProp(source.cancelText, record, context) ??
                    'Hủy',
                okButtonProps: {
                    danger: Boolean(
                        resolveActionProp(action?.danger, record, context),
                    ),
                },
                onOk: () =>
                    run(
                        () => {
                            if (typeof source.call === 'function') {
                                return source.call(record, context)
                            }

                            if (typeof action?.execute === 'function') {
                                return action.execute(record, context)
                            }

                            throw new Error('Thao tác chưa được cấu hình.')
                        },
                        {
                            successMessage: resolveActionProp(
                                source.message ?? action?.successMessage,
                                record,
                                context,
                            ),
                            onSuccess: async (response) => {
                                await source.afterSuccess?.(
                                    response,
                                    record,
                                    context,
                                )
                                await action?.onSuccess?.(
                                    response,
                                    record,
                                    context,
                                )
                            },
                        },
                    ),
            })
        },
        [defaultContext, run],
    )

    return { loading, runConfirm }
}
