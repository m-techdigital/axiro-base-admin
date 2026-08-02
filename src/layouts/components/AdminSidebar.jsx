import { Badge, Layout, Menu } from 'antd'
import { ADMIN_MENU_ITEMS, selectedAdminMenuKey } from '../../configs/adminMenu'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../services/axios'
const { Sider } = Layout

export default function AdminSidebar({ collapsed, setCollapsed, isMobile }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [counters, setCounters] = useState({})

    useEffect(() => {
        let active = true
        const loadCounters = async () => {
            try {
                const response = await api.get('/operations-dashboard/overview')
                if (active) {
                    setCounters(
                        response?.data?.menu_counters ||
                            response?.menu_counters ||
                            {},
                    )
                }
            } catch {
                if (active) setCounters({})
            }
        }

        loadCounters()
        const timer = window.setInterval(loadCounters, 60000)
        return () => {
            active = false
            window.clearInterval(timer)
        }
    }, [])

    const menuItems = useMemo(
        () =>
            ADMIN_MENU_ITEMS.map((item) => {
                const count =
                    item.key === '/notifications'
                        ? counters.unread_notifications
                        : item.key === '/operations-control'
                          ? counters.expired_holds
                          : item.key === '/payments'
                            ? counters.pending_payment_confirmation
                            : item.key === '/disputes'
                              ? counters.open_disputes
                              : 0

                return count
                    ? {
                          ...item,
                          label: (
                              <span className="admin-menu-label">
                                  <span>{item.label}</span>
                                  <Badge
                                      count={count}
                                      overflowCount={99}
                                      size="small"
                                  />
                              </span>
                          ),
                      }
                    : item
            }),
        [counters],
    )
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
                items={menuItems}
                onClick={({ key }) => {
                    navigate(key)
                    if (isMobile) setCollapsed(true)
                }}
            />
        </Sider>
    )
}
