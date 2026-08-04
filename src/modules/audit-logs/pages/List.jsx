import { AUDIT_RISK_OPTIONS } from '@/constants/options'
import { EyeOutlined } from '@ant-design/icons'
import {
    BaseDrawer,
    BaseFilter,
    BaseIconAction,
    BaseListView,
} from '@/components/base'
import { statusLabel, valueLabel } from '@/contracts/marketplaceLabels'
import { Card, Descriptions, Statistic, Tag, Typography } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'

import service from '../service'

const riskColors = {
    normal: 'green',
    warning: 'gold',
    high: 'red',
    critical: 'magenta',
}

const pretty = (value) => (value ? JSON.stringify(value, null, 2) : '—')

const filterFields = [
    {
        name: 'keyword',
        placeholder: 'Tìm nội dung, đường dẫn',
        type: 'search',
    },
    {
        name: 'audit_type',
        placeholder: 'Nhóm nhật ký',
        type: 'select',
        options: [
            'business_trail',
            'system_operation',
            'validation',
            'security',
        ].map((value) => ({
            value,
            label: valueLabel(value),
        })),
    },
    {
        name: 'risk_level',
        placeholder: 'Mức độ',
        type: 'select',
        options: AUDIT_RISK_OPTIONS,
    },
]

const actorText = (row) =>
    row.actor_type
        ? `${valueLabel(row.actor_type)} #${row.actor_id || '—'}`
        : 'Hệ thống'

const entityText = (row) =>
    row.entity_type
        ? `${valueLabel(row.entity_type)} #${row.entity_id || '—'}`
        : '—'

export default function AuditLogList() {
    const [rows, setRows] = useState([])
    const [meta, setMeta] = useState({ pagination: {} })
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [params, setParams] = useState({ page: 1, per_page: 30 })

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const [list, statistics] = await Promise.all([
                service.list(params),
                service.statistics(),
            ])
            setRows(list.data || [])
            setMeta(list.meta || { pagination: {} })
            setStats(statistics.data || {})
        } finally {
            setLoading(false)
        }
    }, [params])

    useEffect(() => {
        load()
    }, [load])

    const columns = useMemo(
        () => [
            {
                title: 'Thời gian',
                dataIndex: 'created_at',
                width: 165,
                render: (value) => new Date(value).toLocaleString('vi-VN'),
            },
            {
                title: 'Nhóm',
                dataIndex: 'audit_type',
                width: 160,
                render: (value) => valueLabel(value),
            },
            {
                title: 'Sự kiện',
                dataIndex: 'event_type',
                width: 170,
                render: (value) => valueLabel(value),
            },
            {
                title: 'Mức độ',
                dataIndex: 'risk_level',
                width: 110,
                render: (value) => (
                    <Tag color={riskColors[value] || 'default'}>
                        {statusLabel(value, valueLabel(value))}
                    </Tag>
                ),
            },
            {
                title: 'Tác nhân',
                width: 170,
                render: (_, row) => actorText(row),
            },
            {
                title: 'Đối tượng',
                width: 190,
                render: (_, row) => entityText(row),
            },
            { title: 'Nội dung', dataIndex: 'title', ellipsis: true },
            {
                title: 'Mã yêu cầu',
                dataIndex: 'request_id',
                width: 150,
                ellipsis: true,
                render: (value) =>
                    value ? (
                        <Typography.Text copyable={{ text: value }}>
                            {value.slice(0, 8)}…
                        </Typography.Text>
                    ) : (
                        '—'
                    ),
            },
            {
                title: 'Thao tác',
                width: 90,
                render: (_, row) => (
                    <BaseIconAction
                        icon={<EyeOutlined />}
                        label="Xem chi tiết"
                        onClick={() => setSelected(row)}
                    />
                ),
            },
        ],
        [],
    )

    const statistics = (
        <div className="base-statistics-grid audit-log-statistics">
            <Card>
                <Statistic title="Tổng nhật ký" value={stats.total || 0} />
            </Card>
            <Card>
                <Statistic title="Trong hôm nay" value={stats.today || 0} />
            </Card>
            <Card>
                <Statistic
                    title="Lỗi xác thực"
                    value={stats.validation_failures || 0}
                />
            </Card>
            <Card>
                <Statistic title="Rủi ro cao" value={stats.high_risk || 0} />
            </Card>
        </div>
    )

    return (
        <>
            <BaseListView
                columns={columns}
                dataSource={rows}
                description="Theo dõi lịch sử nghiệp vụ, thao tác hệ thống, lỗi xác thực và sự kiện rủi ro."
                filters={
                    <BaseFilter
                        fields={filterFields}
                        loading={loading}
                        onReset={() => setParams({ page: 1, per_page: 30 })}
                        onSearch={(values) =>
                            setParams((current) => ({
                                ...current,
                                ...values,
                                page: 1,
                            }))
                        }
                        values={params}
                    />
                }
                loading={loading}
                onChange={(pagination) =>
                    setParams((current) => ({
                        ...current,
                        page: pagination.current,
                        per_page: pagination.pageSize,
                    }))
                }
                onReload={load}
                pagination={{
                    current: meta.pagination?.current_page || 1,
                    pageSize: meta.pagination?.per_page || 30,
                    total: meta.pagination?.total || 0,
                    showSizeChanger: true,
                }}
                scroll={{ x: 'max-content' }}
                showReload
                statistics={statistics}
                title="Nhật ký và lịch sử hệ thống"
            />
            <BaseDrawer
                onClose={() => setSelected(null)}
                open={Boolean(selected)}
                title="Chi tiết nhật ký"
                width={760}
            >
                {selected ? (
                    <>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Thời gian">
                                {new Date(selected.created_at).toLocaleString(
                                    'vi-VN',
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mức độ">
                                <Tag color={riskColors[selected.risk_level]}>
                                    {statusLabel(
                                        selected.risk_level,
                                        valueLabel(selected.risk_level),
                                    )}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Nhóm">
                                {valueLabel(selected.audit_type)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sự kiện">
                                {valueLabel(selected.event_type)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tác nhân">
                                {actorText(selected)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đối tượng">
                                {entityText(selected)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đường dẫn" span={2}>
                                {selected.method} {selected.path}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã yêu cầu" span={2}>
                                <Typography.Text copyable>
                                    {selected.request_id || '—'}
                                </Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Nội dung" span={2}>
                                {selected.title}
                                <br />
                                {selected.description}
                            </Descriptions.Item>
                        </Descriptions>
                        {[
                            ['Dữ liệu cũ', selected.old_values],
                            ['Dữ liệu mới', selected.new_values],
                            ['Trường thay đổi', selected.changed_fields],
                            ['Lỗi xác thực', selected.validation_errors],
                            ['Dữ liệu bổ sung', selected.metadata],
                        ].map(([title, value]) => (
                            <Card
                                key={title}
                                size="small"
                                style={{ marginTop: 16 }}
                                title={title}
                            >
                                <pre
                                    style={{
                                        margin: 0,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {pretty(value)}
                                </pre>
                            </Card>
                        ))}
                    </>
                ) : null}
            </BaseDrawer>
        </>
    )
}
