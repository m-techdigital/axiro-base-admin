import './reconciliation.css'
import { message } from 'antd'
import { lazy, Suspense } from 'react'

import BaseButton from '@/components/base/BaseButton'
import BaseFilter from '@/components/base/BaseFilter'

import { settlementFilters } from '../../config/filters'
import FilterPresetBar from '../FilterPresetBar'

const ReconciliationExportProgress = lazy(
    () => import('./ReconciliationExportProgress'),
)

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
                <Suspense
                    fallback={
                        <section
                            aria-live="polite"
                            className="operations-reconciliation-surface"
                        >
                            <h3>Tiến độ tệp xuất</h3>
                            <p>Đang tải trạng thái tệp xuất…</p>
                        </section>
                    }
                >
                    <ReconciliationExportProgress exportState={exportState} />
                </Suspense>
            ) : null}
        </div>
    )
}
