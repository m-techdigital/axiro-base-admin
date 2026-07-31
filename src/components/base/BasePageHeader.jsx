import { Space, Typography } from 'antd'

export default function BasePageHeader({
    title,
    description,
    actions,
    extra,
    className = '',
}) {
    return (
        <header className={`base-page-header ${className}`.trim()}>
            <div className="base-page-header__copy">
                <Typography.Title level={2}>{title}</Typography.Title>
                {description ? (
                    <Typography.Paragraph>{description}</Typography.Paragraph>
                ) : null}
            </div>
            {actions || extra ? (
                <Space className="base-page-header__actions" wrap>
                    {actions || extra}
                </Space>
            ) : null}
        </header>
    )
}
