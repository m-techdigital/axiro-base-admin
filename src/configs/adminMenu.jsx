import {
    DashboardOutlined,
    InboxOutlined,
    TeamOutlined,
    ShoppingOutlined,
    ShopOutlined,
    SwapOutlined,
    CreditCardOutlined,
    WarningOutlined,
    HistoryOutlined,
    FileTextOutlined,
} from '@ant-design/icons'

export const ADMIN_MENU_ITEMS = [
    { key: '/', icon: <DashboardOutlined />, label: 'Tổng quan' },
    {
        key: '/action-center',
        icon: <InboxOutlined />,
        label: 'Trung tâm xử lý',
    },
    { key: '/customers', icon: <TeamOutlined />, label: 'Khách hàng' },
    { key: '/products', icon: <ShoppingOutlined />, label: 'Sản phẩm' },
    { key: '/transactions', icon: <SwapOutlined />, label: 'Giao dịch' },
    {
        key: '/payments',
        icon: <CreditCardOutlined />,
        label: 'Thanh toán giao dịch',
    },
    { key: '/wallets', icon: <CreditCardOutlined />, label: 'Ví và dòng tiền' },
    {
        key: '/wallet-deposits',
        icon: <CreditCardOutlined />,
        label: 'Nạp tiền',
    },
    {
        key: '/payouts',
        icon: <CreditCardOutlined />,
        label: 'Xác minh và chi trả',
    },
    {
        key: '/operations-control',
        icon: <WarningOutlined />,
        label: 'Điều hành Marketplace',
    },
    {
        key: '/marketplace-operations',
        icon: <WarningOutlined />,
        label: 'Chính sách và yêu cầu',
    },
    {
        key: '/marketplace-trust',
        icon: <HistoryOutlined />,
        label: 'Niềm tin và nội dung',
    },
    {
        key: '/payment-settings',
        icon: <CreditCardOutlined />,
        label: 'Thông tin ngân hàng',
    },
    {
        key: '/document-templates',
        icon: <FileTextOutlined />,
        label: 'Mẫu tài liệu',
    },
    {
        key: '/generated-documents',
        icon: <FileTextOutlined />,
        label: 'Tài liệu phát hành',
    },
    { key: '/disputes', icon: <WarningOutlined />, label: 'Tranh chấp' },
    {
        key: '/audit-logs',
        icon: <HistoryOutlined />,
        label: 'Nhật ký hệ thống',
    },
]

export function selectedAdminMenuKey(pathname) {
    return (
        ADMIN_MENU_ITEMS.find(
            (item) =>
                pathname === item.key ||
                (item.key !== '/' && pathname.startsWith(item.key)),
        )?.key || '/'
    )
}
