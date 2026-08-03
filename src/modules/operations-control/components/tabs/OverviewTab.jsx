import { SyncOutlined, WarningOutlined } from '@ant-design/icons'
import { Alert, Card, Space, Statistic } from 'antd'

import { valueLabel } from '@/contracts/marketplaceLabels'

import { MetricCard } from '../operationsColumns'

export default function OverviewTab({ overview }) {
    return (
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            <Alert
                showIcon
                type={
                    overview.holds?.expired_unreleased ? 'warning' : 'success'
                }
                title="Tình trạng vận hành"
                description={`Có ${overview.holds?.expired_unreleased || 0} hold quá hạn chưa được nhả và ${overview.queues?.dispute || 0} hồ sơ tranh chấp đang mở.`}
            />
            <div className="base-statistics-grid">
                <MetricCard
                    title="Hold đang hoạt động"
                    value={overview.holds?.active}
                />
                <MetricCard
                    title="Hold sắp hết hạn"
                    value={overview.holds?.expiring_soon}
                />
                <MetricCard
                    danger
                    title="Hold quá hạn"
                    value={overview.holds?.expired_unreleased}
                />
                <MetricCard
                    title="Đã nhả hôm nay"
                    value={overview.holds?.released_today}
                />
                <MetricCard
                    title="Chờ thanh toán"
                    value={overview.queues?.pending_payment}
                />
                <MetricCard
                    title="Chờ bàn giao"
                    value={overview.queues?.delivery}
                />
                <MetricCard
                    title="Chờ xác nhận"
                    value={overview.queues?.acceptance}
                />
                <MetricCard
                    danger
                    title="Tranh chấp"
                    value={overview.queues?.dispute}
                />
                <MetricCard
                    danger
                    title="Thuê quá hạn"
                    value={overview.queues?.overdue_rental}
                />
                <MetricCard
                    title="Chờ hoàn trả"
                    value={overview.queues?.pending_return}
                />
                <MetricCard
                    title="Chờ quyết toán cọc"
                    value={overview.queues?.deposit_deduction_review}
                />
            </div>
            <Card title="Việc quá hạn cần xử lý">
                <div className="base-statistics-grid">
                    {Object.entries(overview.sla || {}).map(([key, item]) => (
                        <MetricCard
                            key={key}
                            danger={item.breached > 0}
                            title={`${valueLabel(key)} quá hạn`}
                            value={item.breached}
                            suffix={`/ ${item.total}`}
                        />
                    ))}
                </div>
            </Card>
            <Card title="Checkout lặp">
                <Space size="large" wrap>
                    <Statistic
                        prefix={<SyncOutlined />}
                        title="Phát lại an toàn"
                        value={
                            overview.idempotency?.duplicate_checkout_replays ||
                            0
                        }
                    />
                    <Statistic
                        prefix={<WarningOutlined />}
                        title="Xung đột idempotency"
                        value={overview.idempotency?.idempotency_conflicts || 0}
                        valueStyle={{ color: '#cf1322' }}
                    />
                </Space>
            </Card>
        </Space>
    )
}
