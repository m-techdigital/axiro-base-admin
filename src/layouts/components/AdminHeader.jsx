import { Avatar, Button, Dropdown, Layout, Typography } from 'antd'
import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
const { Header } = Layout

export default function AdminHeader({ collapsed, setCollapsed, title }) {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const name = user?.name || 'Quản trị viên'
    const menu = {
        items: [
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Đăng xuất',
                onClick: async () => {
                    await logout()
                    navigate('/login', { replace: true })
                },
            },
        ],
    }
    return (
        <Header className="admin-header">
            <div className="admin-header__left">
                <Button
                    type="text"
                    className="admin-header__trigger"
                    icon={
                        collapsed ? (
                            <MenuUnfoldOutlined />
                        ) : (
                            <MenuFoldOutlined />
                        )
                    }
                    onClick={() => setCollapsed(!collapsed)}
                />
                <Typography.Title level={4} className="admin-header__title">
                    {title || 'Tổng quan'}
                </Typography.Title>
            </div>
            <Dropdown menu={menu} trigger={['click']} placement="bottomRight">
                <Button className="admin-user-button">
                    <Avatar
                        size={28}
                        src={user?.avatar_url}
                        icon={<UserOutlined />}
                    />
                    <span>{name}</span>
                </Button>
            </Dropdown>
        </Header>
    )
}
