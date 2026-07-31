import { Layout, Menu } from 'antd'
import { ADMIN_MENU_ITEMS, selectedAdminMenuKey } from '../../configs/adminMenu'
import { useLocation, useNavigate } from 'react-router-dom'
const { Sider } = Layout

export default function AdminSidebar({ collapsed, setCollapsed, isMobile }) {
    const navigate = useNavigate()
    const location = useLocation()
    return (
        <Sider
            className="admin-sidebar"
            width={248}
            collapsedWidth={isMobile ? 0 : 80}
            collapsed={collapsed}
            breakpoint="lg"
            trigger={null}
        >
            <button
                type="button"
                className="admin-brand"
                onClick={() => navigate('/')}
                aria-label="Về tổng quan"
            >
                <span className="admin-brand__mark">A</span>
                {!collapsed && (
                    <span>
                        <strong>AXIRO</strong>
                        <small>MBN Admin</small>
                    </span>
                )}
            </button>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedAdminMenuKey(location.pathname)]}
                items={ADMIN_MENU_ITEMS}
                onClick={({ key }) => {
                    navigate(key)
                    if (isMobile) setCollapsed(true)
                }}
            />
        </Sider>
    )
}
