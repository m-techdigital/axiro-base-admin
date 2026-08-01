import { Drawer } from 'antd'

const normalizeDrawerSize = (size, width) => {
    if (size) return size
    if (width === undefined || width === null) return 'default'
    if (typeof width === 'number' && width >= 720) return 'large'
    return 'default'
}

export default function BaseDrawer({
    className = '',
    children,
    size,
    width,
    ...props
}) {
    return (
        <Drawer
            destroyOnHidden
            className={`base-drawer ${className}`.trim()}
            size={normalizeDrawerSize(size, width)}
            {...props}
        >
            {children}
        </Drawer>
    )
}
