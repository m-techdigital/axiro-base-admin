import { BaseFilter, BaseTable } from '@/components/base'

import { holdFilters } from '../../config/filters'

export default function HoldsTab({
    columns,
    loading,
    params,
    rows,
    onParamsChange,
}) {
    return (
        <>
            <BaseFilter
                fields={holdFilters}
                loading={loading}
                onReset={() =>
                    onParamsChange({ state: 'active', per_page: 50 })
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
