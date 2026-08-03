import { Alert, Card, Progress, Space, Statistic, message } from 'antd'

import { BaseButton, BaseFilter, Money } from '@/components/base'
import { valueLabel } from '@/contracts/marketplaceLabels'

import { settlementFilters } from '../../config/filters'
import FilterPresetBar from '../FilterPresetBar'
import { MetricCard } from '../operationsColumns'

export default function ReconciliationTab({
    exportState,
    loading,
    params,
    reconciliation,
    onParamsChange,
}) {
    const requestExport = async () => {
        try {
            await exportState.create(params)
        } catch (error) {
            message.error(
                error.message || 'Không thể xuất quyết toán giao dịch thuê.',
            )
        }
    }

    return (
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            <FilterPresetBar
                storageKey="operations.settlement-presets"
                values={params}
                onApply={onParamsChange}
            />
            <BaseFilter
                fields={settlementFilters}
                loading={loading}
                onReset={() => onParamsChange({})}
                onSearch={onParamsChange}
                values={params}
            />
            <BaseButton onClick={requestExport}>
                Xuất quyết toán giao dịch thuê
            </BaseButton>
            {exportState.request ? (
                <Card size="small" title="Tiến độ tệp xuất">
                    <Space orientation="vertical" style={{ width: '100%' }}>
                        <Progress
                            percent={
                                exportState.request.status === 'completed'
                                    ? 100
                                    : exportState.request.status ===
                                        'processing'
                                      ? 60
                                      : exportState.request.status === 'failed'
                                        ? 100
                                        : 20
                            }
                            status={
                                exportState.request.status === 'failed'
                                    ? 'exception'
                                    : undefined
                            }
                        />
                        <span>
                            Trạng thái: {valueLabel(exportState.request.status)}
                            {exportState.request.row_count
                                ? ` · ${exportState.request.row_count} dòng`
                                : ''}
                        </span>
                        {exportState.request.status === 'completed' ? (
                            <BaseButton onClick={exportState.download}>
                                Tải tệp CSV
                            </BaseButton>
                        ) : null}
                    </Space>
                </Card>
            ) : null}
            <div className="base-statistics-grid">
                <MetricCard
                    title="Thanh toán chờ duyệt"
                    value={reconciliation.payments?.submitted_count}
                />
                <MetricCard
                    danger
                    title="Thanh toán quá hạn"
                    value={reconciliation.payments?.overdue_count}
                />
                <Card size="small">
                    <Statistic
                        title="Tiền ví khả dụng"
                        valueRender={() => (
                            <Money value={reconciliation.wallet?.available} />
                        )}
                        value={0}
                    />
                </Card>
                <Card size="small">
                    <Statistic
                        title="Tiền đang giữ"
                        valueRender={() => (
                            <Money value={reconciliation.wallet?.held} />
                        )}
                        value={0}
                    />
                </Card>
                <Card size="small">
                    <Statistic
                        title="Payout đang chờ"
                        valueRender={() => (
                            <Money value={reconciliation.payouts?.submitted} />
                        )}
                        value={0}
                    />
                </Card>
                <Card size="small">
                    <Statistic
                        title="Đã hoàn"
                        valueRender={() => (
                            <Money value={reconciliation.refunds?.amount} />
                        )}
                        value={0}
                    />
                </Card>
            </div>
            <Alert
                showIcon
                type={
                    Object.values(reconciliation.imbalances || {}).some(Boolean)
                        ? 'error'
                        : 'success'
                }
                title="Kiểm tra mất cân đối"
                description={`Ví âm: ${reconciliation.imbalances?.wallet_negative || 0}; giao dịch trả thừa: ${reconciliation.imbalances?.transaction_overpaid || 0}; giải ngân vượt escrow: ${reconciliation.imbalances?.release_exceeds_escrow || 0}.`}
            />
        </Space>
    )
}
