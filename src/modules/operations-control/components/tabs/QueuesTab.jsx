import { BaseFilter, BaseTable } from '@/components/base'

import { queueFilters } from '../../config/filters'
import FilterPresetBar from '../FilterPresetBar'

export default function QueuesTab({
    columns,
    loading,
    params,
    rows,
    onParamsChange,
}) {
    return (
        <>
            <FilterPresetBar
                storageKey="operations.queue-presets"
                values={params}
                onApply={onParamsChange}
            />
            <BaseFilter
                fields={queueFilters}
                loading={loading}
                onReset={() =>
                    onParamsChange({ age_minutes: 30, per_page: 50 })
                }
                onSearch={(values) =>
                    onParamsChange({ ...values, per_page: 50 })
                }
                values={params}
            />
            <BaseTable
                columns={columns}
                dataSource={rows}
                loading={loading}
                pagination={false}
                rowKey="id"
            />
        </>
    )
}
