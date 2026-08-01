import { useMemo, useCallback } from 'react'
import { Table } from 'antd'

export function useTableSummary(columns, dataSource) {
    // ================= NORMALIZE KEY =================
    const getKey = (col) => {
        if (!col.dataIndex) return null
        if (Array.isArray(col.dataIndex)) {
            return col.dataIndex.join('.')
        }
        return col.dataIndex
    }

    // ================= CALCULATE SUMMARY =================
    const summaryData = useMemo(() => {
        const result = {}

        columns.forEach((col) => {
            if (!col.summary) return

            const key = getKey(col)
            if (!key) return

            result[key] = dataSource.reduce((sum, row) => {
                const value = row?.[key]
                const num = Number(value ?? 0)
                return sum + (Number.isNaN(num) ? 0 : num)
            }, 0)
        })

        return result
    }, [columns, dataSource])

    // ================= FORMAT =================
    const formatSummaryValue = useCallback((col, value) => {
        if (value == null) return ''

        if (col.summaryFormatter) {
            return col.summaryFormatter(value)
        }

        if (col.type === 'number_formatter') {
            const formatted = new Intl.NumberFormat('vi-VN').format(value)
            return col.unit ? `${formatted} ${col.unit}` : formatted
        }

        return value
    }, [])

    // ================= RENDER SUMMARY =================
    const renderSummary = useCallback(
        (enhancedColumns) => {
            const hasSummary = columns.some((c) => c.summary)
            if (!hasSummary) return null

            return (
                <Table.Summary fixed>
                    <Table.Summary.Row className="base-table-summary-row">
                        {enhancedColumns.map((col, index) => {
                            const key = getKey(col)

                            const isFirst = index === 0
                            const align = col.align || 'left'
                            const color = col.color

                            // LABEL CELL
                            if (isFirst) {
                                return (
                                    <Table.Summary.Cell
                                        key={`summary-first-${index}`}
                                        index={index}
                                        align={align}
                                        fixed={col.fixed}
                                    >
                                        <b style={{ color }}>Tổng</b>
                                    </Table.Summary.Cell>
                                )
                            }

                            // SUMMARY CELL
                            if (col.summary && key) {
                                const value = summaryData[key]

                                return (
                                    <Table.Summary.Cell
                                        key={`summary-${key}-${index}`}
                                        index={index}
                                        align={align}
                                        fixed={col.fixed}
                                    >
                                        <b style={{ color }}>
                                            {formatSummaryValue(col, value)}
                                        </b>
                                    </Table.Summary.Cell>
                                )
                            }

                            // EMPTY CELL
                            return (
                                <Table.Summary.Cell
                                    key={`empty-${index}`}
                                    index={index}
                                    align={align}
                                    fixed={col.fixed}
                                />
                            )
                        })}
                    </Table.Summary.Row>
                </Table.Summary>
            )
        },
        [columns, summaryData, formatSummaryValue],
    )

    return {
        summaryData,
        formatSummaryValue,
        renderSummary,
    }
}
