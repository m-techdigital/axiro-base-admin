import { Button } from 'antd'

/**
 * BaseFormFooter
 * --------------------------------------------
 * Footer chuẩn cho các form CRUD:
 * - Có thể bật/tắt nút Cancel
 * - Submit full width nếu không có Cancel
 */
export default function BaseFormFooter({
    isCancel = true,
    onCancel,
    loading = false,
    submitText = 'Lưu',
    cancelText = 'Huỷ',
    submitDisabled = false,
    style = {},
}) {
    return (
        <div className="base-form-footer" style={style}>
            <div
                style={{
                    display: 'flex',
                    gap: 12,
                    justifyContent: isCancel ? 'flex-end' : 'stretch',
                }}
            >
                {isCancel && <Button onClick={onCancel}>{cancelText}</Button>}

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={submitDisabled}
                    style={{
                        width: isCancel ? 'auto' : '100%',
                    }}
                >
                    {submitText}
                </Button>
            </div>
        </div>
    )
}
