import { Drawer } from 'antd'
export default function BaseDrawer({ className = '', children, ...props }) {
    return (
        <Drawer
            destroyOnHidden
            className={`base-drawer ${className}`.trim()}
            {...props}
        >
            {children}
        </Drawer>
    )
}
