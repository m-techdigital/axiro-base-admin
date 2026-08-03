import { BaseButton, BasePageHeader } from '@/components/base'
import { Alert, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import TransactionCommandCenter from '../components/TransactionCommandCenter'
import TransactionDetailModals from '../components/TransactionDetailModals'
import TransactionDetailSections from '../components/TransactionDetailSections'
import { transactionLabels } from '../config/detailPresentation'
import useTransactionDetail from '../hooks/useTransactionDetail'

export default function TransactionDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const {
        data,
        loading,
        acting,
        preview,
        documentLabels,
        disputeOutcomeLabels,
        deductionModalOpen,
        deductionAmount,
        deductionNote,
        load,
        act,
        confirmPayment,
        completeRental,
        closeDeductionModal,
        ensureDocuments,
        viewDocument,
        downloadDocument,
        setPreview,
        setDeductionModalOpen,
        setDeductionAmount,
        setDeductionNote,
    } = useTransactionDetail(id)
    return (
        <div className="page">
            <BasePageHeader
                title={`Giao dịch ${data?.code || ''}`}
                description="Theo dõi thanh toán, tài liệu, tranh chấp và các hành động khép vòng giao dịch."
                actions={
                    <Space>
                        <BaseButton onClick={() => navigate('/transactions')}>
                            Quay lại
                        </BaseButton>
                        <BaseButton onClick={load}>Tải lại</BaseButton>
                    </Space>
                }
            />
            {data?.status === 'disputed' && (
                <Alert
                    type="warning"
                    showIcon
                    message="Giao dịch đang tranh chấp"
                    description="Không nên hoàn tất hoặc hủy trước khi đối chiếu đầy đủ bằng chứng."
                />
            )}
            <TransactionCommandCenter
                data={data}
                loading={loading}
                onAction={(action) =>
                    act(
                        action,
                        `Thực hiện: ${transactionLabels[action] || action}`,
                    )
                }
                onConfirmPayment={(paymentId) => confirmPayment(paymentId)}
            />
            <TransactionDetailSections
                data={data}
                loading={loading}
                acting={acting}
                documentLabels={documentLabels}
                disputeOutcomeLabels={disputeOutcomeLabels}
                confirmPayment={confirmPayment}
                ensureDocuments={ensureDocuments}
                viewDocument={viewDocument}
                downloadDocument={downloadDocument}
                act={act}
                onOpenRentalCompletion={() => setDeductionModalOpen(true)}
            />
            <TransactionDetailModals
                data={data}
                acting={acting}
                deductionModalOpen={deductionModalOpen}
                deductionAmount={deductionAmount}
                deductionNote={deductionNote}
                preview={preview}
                onCloseDeduction={closeDeductionModal}
                onCompleteRental={completeRental}
                onDeductionAmountChange={setDeductionAmount}
                onDeductionNoteChange={setDeductionNote}
                onClosePreview={() => setPreview(null)}
            />
        </div>
    )
}
