import { Typography } from 'antd'
import { Link } from 'react-router-dom'

const { Text } = Typography

const getValue = (record, path) => {
    if (!path) return undefined
    if (typeof path === 'function') return path(record)
    if (Array.isArray(path)) {
        return path.reduce((value, key) => value?.[key], record)
    }

    return String(path)
        .split('.')
        .reduce((value, key) => value?.[key], record)
}

export const renderIdentity = (record = {}, config = {}) => {
    const title =
        getValue(record, config.titleKey || config.dataIndex || 'name') ||
        config.fallback ||
        '-'
    const subtitle = getValue(record, config.subtitleKey || 'code')
    const linkTo =
        typeof config.linkTo === 'function'
            ? config.linkTo(record)
            : getValue(record, config.linkTo)
    const titleNode = linkTo ? <Link to={linkTo}>{title}</Link> : title

    return (
        <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: config.titleWeight || 700 }}>
                {titleNode}
            </div>
            {subtitle ? (
                <Text type="secondary" ellipsis={config.ellipsis ?? true}>
                    {config.subtitlePrefix || ''}
                    {subtitle}
                </Text>
            ) : null}
        </div>
    )
}
