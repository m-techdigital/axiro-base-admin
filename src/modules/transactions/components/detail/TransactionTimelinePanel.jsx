import Money from '../../../../components/base/Money'
import { valueLabel } from '../../../../contracts/marketplaceLabels'
import { Card, List, Tag, Timeline, Typography } from 'antd'

export default function TransactionTimelinePanel({
    data,
    loading,
    disputeOutcomeLabels,
}) {
    return (
        <>
            <Card loading={loading} title="Tiến trình hai phía">
                <Timeline
                    items={(data?.events || []).map((item) => ({
                        children: (
                            <>
                                <b>{item.title}</b>
                                <div>{item.description || ''}</div>
                                {item.metadata?.outcome && (
                                    <Tag color="purple">
                                        Kết quả:{' '}
                                        {disputeOutcomeLabels[
                                            item.metadata.outcome
                                        ] || valueLabel(item.metadata.outcome)}
                                    </Tag>
                                )}
                                {Number(
                                    item.metadata
                                        ?.rental_deposit_deduction_amount || 0,
                                ) > 0 && (
                                    <div>
                                        Khấu trừ cọc:{' '}
                                        <Money
                                            value={
                                                item.metadata
                                                    .rental_deposit_deduction_amount
                                            }
                                        />
                                    </div>
                                )}
                                <small>
                                    {new Date(item.created_at).toLocaleString(
                                        'vi-VN',
                                    )}
                                </small>
                            </>
                        ),
                    }))}
                />
            </Card>
            <Card
                loading={loading}
                title="Checklist xử lý"
                style={{ marginTop: 16 }}
            >
                <List
                    dataSource={data?.workflow_checklist || []}
                    locale={{ emptyText: 'Chưa có dữ liệu checklist.' }}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.label}
                                description={item.detail}
                            />
                            <Tag
                                color={
                                    item.status === 'completed'
                                        ? 'green'
                                        : item.status === 'attention'
                                          ? 'red'
                                          : item.status === 'pending'
                                            ? 'gold'
                                            : 'default'
                                }
                            >
                                {item.status === 'completed'
                                    ? 'Đã xong'
                                    : item.status === 'attention'
                                      ? 'Cần xử lý'
                                      : item.status === 'pending'
                                        ? 'Đang chờ'
                                        : 'Không phát sinh'}
                            </Tag>
                        </List.Item>
                    )}
                />
            </Card>
            <Card
                loading={loading}
                title="Lịch sử kiểm tra hệ thống"
                style={{ marginTop: 16 }}
            >
                <Timeline
                    items={(data?.audit_history || [])
                        .slice(0, 30)
                        .map((item) => ({
                            color:
                                item.risk_level === 'high'
                                    ? 'red'
                                    : item.audit_type === 'validation'
                                      ? 'gold'
                                      : 'blue',
                            children: (
                                <>
                                    <b>{item.title}</b>
                                    <div>{item.description || ''}</div>
                                    <small>
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleString('vi-VN')}{' '}
                                        · {item.actor_type || 'system'} #
                                        {item.actor_id || '—'}
                                    </small>
                                    {item.request_id && (
                                        <div>
                                            <Typography.Text
                                                copyable={{
                                                    text: item.request_id,
                                                }}
                                            >
                                                Mã yêu cầu:{' '}
                                                {item.request_id.slice(0, 8)}…
                                            </Typography.Text>
                                        </div>
                                    )}
                                </>
                            ),
                        }))}
                />
            </Card>
        </>
    )
}
