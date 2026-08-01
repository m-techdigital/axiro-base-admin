import { Card, Space, Tag, Typography } from 'antd'

const { Text } = Typography

export default function BaseStatusSummaryBar({
    items = [],
    description,
    card = true,
    style,
}) {
    const content = (
        <Space orientation="vertical" size={10} style={{ width: '100%' }}>
            <Space wrap>
                {items.map((item) => (
                    <Tag
                        color={item.color || 'blue'}
                        key={item.key || item.label}
                    >
                        {item.label} {item.value ?? 0}
                    </Tag>
                ))}
            </Space>
            {description && <Text type="secondary">{description}</Text>}
        </Space>
    )

    if (!card) return content

    return <Card style={style}>{content}</Card>
}
