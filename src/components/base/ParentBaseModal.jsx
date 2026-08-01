import { Modal, Button } from 'antd'

export default function BaseModal({
    title,
    open,
    onCancel,
    onSubmit,
    submitText = 'Lưu',
    cancelText = 'Hủy',
    children,
    loading = false,
    footer,
    width,
    className = '',
    bodyClassName = '',
    centered = true,
    maxHeight = '80vh',
    bodyMaxHeight,
    maskClosable,
    mask,
    submitProps,
    cancelProps,
    style,
    ...props
}) {
    const resolvedFooter =
        footer !== undefined
            ? footer
            : onSubmit
              ? [
                    <Button key="cancel" onClick={onCancel} {...cancelProps}>
                        {cancelText}
                    </Button>,

                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={onSubmit}
                        {...submitProps}
                    >
                        {submitText}
                    </Button>,
                ]
              : null
    const resolvedMask =
        maskClosable === undefined
            ? mask
            : {
                  ...(typeof mask === 'object' && mask !== null ? mask : {}),
                  closable: maskClosable,
              }

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            destroyOnHidden
            forceRender
            centered={centered}
            footer={resolvedFooter}
            width={width}
            className={`base-modal ${className}`.trim()}
            style={{
                '--base-modal-body-max-height': bodyMaxHeight || maxHeight,
                ...style,
            }}
            mask={resolvedMask}
            {...props}
        >
            <div className={`base-modal-body ${bodyClassName}`.trim()}>
                {children}
            </div>
        </Modal>
    )
}
