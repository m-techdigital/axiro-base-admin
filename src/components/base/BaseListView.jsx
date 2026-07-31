import { Card } from 'antd'

import BaseTable from './BaseTable'

export default function BaseListView({
    header,
    filters,
    children,
    cardProps,
    tableCardProps,
    ...tableProps
}) {
    return (
        <section className="base-list-view">
            {header}
            {filters ? (
                <Card className="base-list-view__filters" size="small">
                    {filters}
                </Card>
            ) : null}
            <Card
                className="base-list-view__card"
                {...cardProps}
                {...tableCardProps}
            >
                {children || <BaseTable {...tableProps} />}
            </Card>
        </section>
    )
}
