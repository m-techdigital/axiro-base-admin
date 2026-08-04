import { Progress } from 'antd'

import BaseButton from '@/components/base/BaseButton'
import { valueLabel } from '@/contracts/marketplaceLabels'

export default function ReconciliationExportProgress({ exportState }) {
    const progress =
        exportState.request?.status === 'completed'
            ? 100
            : exportState.request?.status === 'processing'
              ? 60
              : exportState.request?.status === 'failed'
                ? 100
                : 20

    if (!exportState.request) return null

    return (
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
    )
}
