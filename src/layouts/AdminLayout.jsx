import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AdminSidebar from './components/AdminSidebar'
import AdminHeader from './components/AdminHeader'
import { useIsMobile } from '../hooks/useIsMobile'
import { useRouteMeta } from '../hooks/useRouteMeta'
const { Content } = Layout

export default function AdminLayout() {
    const isMobile = useIsMobile()
    const [mobileCollapsed, setMobileCollapsed] = useState(true)
    const [desktopCollapsed, setDesktopCollapsed] = useState(false)
    const collapsed = isMobile ? mobileCollapsed : desktopCollapsed
    const setCollapsed = isMobile ? setMobileCollapsed : setDesktopCollapsed
    const routeMeta = useRouteMeta()
    useEffect(() => {
        if (isMobile) setMobileCollapsed(true)
    }, [isMobile])
    return (
        <Layout className="admin-layout">
            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
            />
            {isMobile && !collapsed && (
                <button
                    type="button"
                    className="admin-sidebar-backdrop"
                    aria-label="Đóng menu"
                    onClick={() => setCollapsed(true)}
                />
            )}
            <Layout className="admin-main-layout">
                <AdminHeader
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    title={routeMeta?.title}
                />
                <Content className="admin-content">
                    <div className="admin-content__body">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}
