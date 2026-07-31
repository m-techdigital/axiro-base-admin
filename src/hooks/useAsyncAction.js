import { useCallback, useState } from 'react'

import { notifyError, notifySuccess } from '@/utils'

export const unwrapResponse = (response, fallback = null) =>
    response?.data?.data ?? response?.data ?? response ?? fallback

export function useAsyncAction() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const run = useCallback(async (action, options = {}) => {
        setLoading(true)
        setError(null)

        try {
            const response = await action()
            notifySuccess(options.successMessage)
            await options.onSuccess?.(response)

            return response
        } catch (nextError) {
            setError(nextError)

            if (options.silentError !== true) {
                notifyError(nextError, options.errorMessage)
            }

            await options.onError?.(nextError)
            throw nextError
        } finally {
            setLoading(false)
        }
    }, [])

    return { loading, error, run }
}
