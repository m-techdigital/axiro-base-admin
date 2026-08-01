import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'

function normalizeItem(item, index) {
    if (typeof item === 'string') {
        return { key: `${item}-${index}`, title: item }
    }

    const title = item?.path ? (
        <Link to={item.path}>{item.title}</Link>
    ) : (
        item?.title
    )
    return {
        ...item,
        key: item?.key || item?.path || `${item?.title}-${index}`,
        title,
    }
}

export default function BaseBreadcrumb({ items = [], className = '' }) {
    if (!items.length) return null
    return (
        <Breadcrumb
            className={`base-breadcrumb ${className}`.trim()}
            items={items.map(normalizeItem)}
        />
    )
}
