import './reconciliation.css'
import { Progress, message } from 'antd'

import BaseButton from '@/components/base/BaseButton'
import BaseFilter from '@/components/base/BaseFilter'
import { valueLabel } from '@/contracts/marketplaceLabels'

import { settlementFilters } from '../../config/filters'
import FilterPresetBar from '../FilterPresetBar'

export default function ReconciliationExportWorkspace({
    exportState,
    loading,
    params,
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

    const progress =
        exportState.request?.status === 'completed'
            ? 100
            : exportState.request?.status === 'processing'
              ? 60
              : exportState.request?.status === 'failed'
                ? 100
                : 20

    return (
        <div className="operations-reconciliation-stack">
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
                <section className="operations-reconciliation-surface">
                    <h3>Tiến độ tệp xuất</h3>
                    <Progress
                        percent={progress}
                        status={
                            exportState.request.status === 'failed'
                                ? 'exception'
                                : undefined
                        }
                    />
                    <p>
                        Trạng thái: {valueLabel(exportState.request.status)}
                        {exportState.request.row_count
                            ? ` · ${exportState.request.row_count} dòng`
                            : ''}
                    </p>
                    {exportState.request.status === 'completed' ? (
                        <BaseButton onClick={exportState.download}>
                            Tải tệp CSV
                        </BaseButton>
                    ) : null}
                </section>
            ) : null}
        </div>
    )
}
