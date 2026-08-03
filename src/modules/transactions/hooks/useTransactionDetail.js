import { BaseModal } from '@/components/base'
import {
    loadMarketplaceOptions,
    optionMap,
} from '@/services/marketplaceOptions'
import { message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import documentService from '../../generated-documents/service'
import service from '../service'

export default function useTransactionDetail(id) {
    const [documentTypes, setDocumentTypes] = useState([])
    const [disputeOutcomes, setDisputeOutcomes] = useState([])
    const [deductionModalOpen, setDeductionModalOpen] = useState(false)
    const [deductionAmount, setDeductionAmount] = useState(0)
    const [deductionNote, setDeductionNote] = useState('')
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [acting, setActing] = useState('')
    const [preview, setPreview] = useState(null)

    const documentLabels = useMemo(
        () => optionMap(documentTypes),
        [documentTypes],
    )
    const disputeOutcomeLabels = useMemo(
        () => optionMap(disputeOutcomes),
        [disputeOutcomes],
    )

    useEffect(() => {
        loadMarketplaceOptions().then((options) => {
            setDocumentTypes(options.document_types || [])
            setDisputeOutcomes(options.dispute_outcomes || [])
        })
    }, [])

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response = await service.get(id)
            setData(response.data)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        load()
    }, [load])

    const act = (action, title) =>
        BaseModal.confirm({
            title,
            content:
                'Hành động quản trị sẽ được ghi vào nhật ký và thông báo cho cả hai bên.',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                setActing(action)
                try {
                    await service.action(id, { action, note: title })
                    message.success('Đã cập nhật giao dịch')
                    await load()
                } catch (error) {
                    message.error(error.message)
                } finally {
                    setActing('')
                }
            },
        })

    const confirmPayment = async (paymentId) => {
        setActing(`payment-${paymentId}`)
        try {
            await service.confirmPayment(paymentId)
            message.success('Đã xác nhận thanh toán')
            await load()
        } catch (error) {
            message.error(error.message || 'Không thể xác nhận thanh toán')
        } finally {
            setActing('')
        }
    }

    const completeRental = async () => {
        if (deductionAmount > 0 && !deductionNote.trim()) {
            message.warning('Vui lòng nhập lý do khấu trừ tiền cọc')
            return
        }

        setActing('complete')
        try {
            await service.action(id, {
                action: 'complete',
                note: 'Hoàn tất giao dịch thuê và quyết toán tiền cọc.',
                rental_deposit_deduction_amount: deductionAmount || 0,
                rental_deposit_deduction_note:
                    deductionAmount > 0 ? deductionNote : null,
            })
            message.success('Đã hoàn tất và quyết toán giao dịch thuê')
            closeDeductionModal()
            await load()
        } catch (error) {
            message.error(error.message || 'Không thể hoàn tất giao dịch thuê')
        } finally {
            setActing('')
        }
    }

    const closeDeductionModal = () => {
        setDeductionModalOpen(false)
        setDeductionAmount(0)
        setDeductionNote('')
    }

    const ensureDocuments = async () => {
        setActing('documents')
        try {
            await documentService.ensure(id)
            message.success('Đã đồng bộ bộ tài liệu theo trạng thái giao dịch')
            await load()
        } catch (error) {
            message.error(
                error.message || 'Không thể đồng bộ tài liệu giao dịch',
            )
        } finally {
            setActing('')
        }
    }

    const viewDocument = async (transactionDocument) =>
        setPreview((await documentService.preview(transactionDocument.id)).data)

    const downloadDocument = async (transactionDocument) => {
        const blob = await documentService.download(transactionDocument.id)
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `${transactionDocument.code}.pdf`
        anchor.click()
        URL.revokeObjectURL(url)
    }

    return {
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
    }
}
