import { Tag } from 'antd'

export const renderCode = (value, config = {}) => {
    if (value === null || value === undefined || value === '') {
        return '-'
    }

    return (
        <Tag
            color={config.color || 'default'}
            style={{
                fontFamily: 'monospace',
                fontWeight: 500,
            }}
        >
            {(config.prefix ?? '#') + value}
        </Tag>
    )
}
