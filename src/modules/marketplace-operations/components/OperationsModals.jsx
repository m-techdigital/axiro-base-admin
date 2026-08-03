import { BaseForm, BaseModal } from '@/components/base'
import { feePolicyFields, operationCaseFields } from '../config/formConfig'

export default function OperationsModals({
    form,
    feeOpen,
    selected,
    onCloseFee,
    onCloseCase,
    onSaveFee,
    onUpdateCase,
}) {
    return (
        <>
            <BaseModal
                destroyOnClose
                footer={null}
                onCancel={onCloseFee}
                open={feeOpen}
                title="Chính sách phí"
                width={760}
            >
                <BaseForm
                    fields={feePolicyFields}
                    form={form}
                    isCancel={false}
                    onFinish={onSaveFee}
                    showFooter
                    submitText="Lưu chính sách"
                />
            </BaseModal>
            <BaseModal
                footer={null}
                onCancel={onCloseCase}
                open={Boolean(selected)}
                title={`Xử lý ${selected?.code || ''}`}
            >
                <BaseForm
                    fields={operationCaseFields}
                    initialValues={{
                        priority: selected?.priority || 'normal',
                        status: selected?.status || 'reviewing',
                    }}
                    isCancel={false}
                    key={selected?.id}
                    onFinish={onUpdateCase}
                    showFooter
                    submitText="Cập nhật"
                />
            </BaseModal>
        </>
    )
}
