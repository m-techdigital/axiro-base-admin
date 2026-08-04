import { List, Space, Tag, Typography } from 'antd'
import { formatCurrency } from '../../../utils/format'

export default function TransactionCommandGuidance({ guidance = [] }) {
    if (!guidance.length) return null

    return (
        <List
            size="small"
            header={
                <Typography.Text strong>
                    Thông tin vận hành cần theo dõi
                </Typography.Text>
            }
            dataSource={guidance}
            renderItem={(item) => (
                <List.Item>
                    <div>
                        <Typography.Text strong>{item.label}</Typography.Text>
                        {item.message ? (
                            <Typography.Paragraph
                                type="secondary"
                                style={{ marginBottom: 4 }}
                            >
                                {item.message}
                            </Typography.Paragraph>
                        ) : null}
                        <Space wrap>
                            {item.value != null ? (
                                <Tag color="blue">
                                    Cần trả: {formatCurrency(item.value)}
                                </Tag>
                            ) : null}
                            {item.rental_amount != null ? (
                                <Tag>
                                    Tiền thuê:{' '}
                                    {formatCurrency(item.rental_amount)}
                                </Tag>
                            ) : null}
                            {item.deposit_amount != null ? (
                                <Tag>
                                    Tiền cọc:{' '}
                                    {formatCurrency(item.deposit_amount)}
                                </Tag>
                            ) : null}
                            {item.deduction_amount != null ? (
                                <Tag color="orange">
                                    Khấu trừ:{' '}
                                    {formatCurrency(item.deduction_amount)}
                                </Tag>
                            ) : null}
                            {item.refundable_amount != null ? (
                                <Tag color="green">
                                    Hoàn lại:{' '}
                                    {formatCurrency(item.refundable_amount)}
                                </Tag>
                            ) : null}
                            {item.due_at ? (
                                <Tag color="purple">Hạn: {item.due_at}</Tag>
                            ) : null}
                        </Space>
                    </div>
                </List.Item>
            )}
        />
    )
}
