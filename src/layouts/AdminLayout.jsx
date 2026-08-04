import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'

import AdminThemeProvider from '../app/providers/AdminThemeProvider'
import { useIsMobile } from '../hooks/useIsMobile'
import { useRouteMeta } from '../hooks/useRouteMeta'
import AdminHeader from './components/AdminHeader'
import AdminSidebar from './components/AdminSidebar'

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
        <AdminThemeProvider>
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
                        <div className="admin-content-body">
                            <Outlet />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </AdminThemeProvider>
    )
}
