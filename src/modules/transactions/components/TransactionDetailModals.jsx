import { BaseModal } from '@/components/base'
import { Input, InputNumber, Space, Typography } from 'antd'
import Money from '../../../components/base/Money'

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
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Typography.Text>
                        Tiền cọc hiện tại:{' '}
                        <Money value={data?.deposit_amount} />
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
