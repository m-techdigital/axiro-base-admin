import { Modal } from 'antd'
function BaseModal({ className = '', children, ...props }) {
    return (
        <Modal
            destroyOnHidden
            centered
            className={`base-modal ${className}`.trim()}
            {...props}
        >
            <div className="base-modal__body">{children}</div>
        </Modal>
    )
}
BaseModal.confirm = Modal.confirm
BaseModal.info = Modal.info
BaseModal.success = Modal.success
BaseModal.error = Modal.error
BaseModal.warning = Modal.warning
BaseModal.destroyAll = Modal.destroyAll
export default BaseModal
