import ParentBaseModal from './ParentBaseModal.jsx'

/**
 * Compatibility adapter around the AXIRO parent BaseModal.
 *
 * New Mini code should use the parent contract:
 *   onSubmit, submitText, loading, submitProps, cancelProps.
 * Legacy aliases remain temporarily supported so existing modules can be
 * migrated without maintaining a second modal implementation.
 */
export default function BaseModal({
    onOk,
    okText,
    confirmLoading,
    okButtonProps,
    cancelButtonProps,
    destroyOnClose,
    destroyOnHidden,
    ...props
}) {
    return (
        <ParentBaseModal
            {...props}
            cancelProps={props.cancelProps ?? cancelButtonProps}
            destroyOnHidden={destroyOnHidden ?? destroyOnClose}
            loading={props.loading ?? confirmLoading}
            onSubmit={props.onSubmit ?? onOk}
            submitProps={props.submitProps ?? okButtonProps}
            submitText={props.submitText ?? okText}
        />
    )
}
