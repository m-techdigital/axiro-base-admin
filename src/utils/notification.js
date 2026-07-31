import { message } from 'antd'

export const notifySuccess = (content) => {
    if (content) {
        message.success(content)
    }
}

export const notifyError = (error, fallback = 'Không thể xử lý thao tác.') => {
    const content = error?.message || fallback
    const supportCode = error?.requestId || error?.correlationId

    message.error(
        supportCode ? `${content} (Mã hỗ trợ: ${supportCode})` : content,
    )
}
