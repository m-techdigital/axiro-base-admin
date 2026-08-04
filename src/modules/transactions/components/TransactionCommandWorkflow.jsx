import { Progress, Space, Tag, Typography } from 'antd'

export default function TransactionCommandWorkflow({ checklist = [] }) {
    const completed = checklist.filter(
        (item) => item.status === 'completed',
    ).length

    return (
        <div>
            <Typography.Text strong>Tiến độ hồ sơ</Typography.Text>
            <Progress
                percent={
                    checklist.length
                        ? Math.round((completed / checklist.length) * 100)
                        : 0
                }
                size="small"
            />
            <Space wrap>
                {checklist.map((item) => (
                    <Tag
                        key={item.key}
                        color={
                            item.status === 'completed'
                                ? 'green'
                                : item.status === 'attention'
                                  ? 'red'
                                  : 'default'
                        }
                    >
                        {item.label}: {item.detail}
                    </Tag>
                ))}
            </Space>
        </div>
    )
}
