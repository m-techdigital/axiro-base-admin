import { BaseModal } from '@/components/base'
import { Input, InputNumber, Space, Typography } from 'antd'
import Money from '../../../components/base/Money'
import { rentalMoneyBreakdown } from '../config/rentalMoney'

export default function TransactionDetailModals({
    data,
    acting,
    deductionModalOpen,
    deductionAmount,
    deductionNote,
    preview,
    onCloseDeduction,
    onCompleteRental,
    onDeductionAmountChange,
    onDeductionNoteChange,
    onClosePreview,
}) {
    const rentalMoney = rentalMoneyBreakdown({
        rentalAmount: data?.transaction_value,
        depositAmount: data?.deposit_amount,
        deductionAmount,
    })

    return (
        <>
            <BaseModal
                open={deductionModalOpen}
                onCancel={onCloseDeduction}
                onSubmit={onCompleteRental}
                submitText="Hoàn tất và quyết toán"
                loading={acting === 'complete'}
                title="Quyết toán tiền cọc thuê"
            >
                <Space orientation="vertical" style={{ width: '100%' }}>
                    <Typography.Text>
                        Tiền thuê: <Money value={rentalMoney.rentalAmount} />
                    </Typography.Text>
                    <Typography.Text>
                        Tiền cọc: <Money value={rentalMoney.depositAmount} />
                    </Typography.Text>
                    <Typography.Text>
                        Cần thanh toán ban đầu:{' '}
                        <Money value={rentalMoney.initialAmount} />
                    </Typography.Text>
                    <Typography.Text
                        type={deductionAmount > 0 ? 'warning' : undefined}
                    >
                        Số tiền dự kiến hoàn lại:{' '}
                        <Money value={rentalMoney.refundableAmount} />
                    </Typography.Text>
                    <label>
                        Số tiền khấu trừ
                        <InputNumber
                            min={0}
                            max={Number(data?.deposit_amount || 0)}
                            value={deductionAmount}
                            onChange={(value) =>
                                onDeductionAmountChange(Number(value || 0))
                            }
                            style={{ width: '100%' }}
                        />
                    </label>
                    <label>
                        Lý do khấu trừ
                        <Input.TextArea
                            rows={4}
                            value={deductionNote}
                            disabled={deductionAmount <= 0}
                            onChange={(event) =>
                                onDeductionNoteChange(event.target.value)
                            }
                            placeholder="Bắt buộc khi có khấu trừ cọc"
                        />
                    </label>
                </Space>
            </BaseModal>
            <BaseModal
                open={!!preview}
                onCancel={onClosePreview}
                footer={null}
                width={900}
                title={preview?.title}
            >
                <div
                    className="document-preview"
                    dangerouslySetInnerHTML={{ __html: preview?.html || '' }}
                />
            </BaseModal>
        </>
    )
}
