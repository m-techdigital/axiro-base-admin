import ConfigProvider from 'antd/es/config-provider'
import viVN from 'antd/locale/vi_VN'

const theme = {
    token: {
        colorPrimary: '#1677ff',
        colorInfo: '#1677ff',
        borderRadius: 10,
        colorBgLayout: '#eef5ff',
        colorText: '#071c4d',
        fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    components: {
        Layout: { headerBg: '#ffffff', siderBg: '#03122f' },
        Menu: {
            darkItemBg: '#03122f',
            darkItemSelectedBg: '#0e5eff',
            darkItemHoverBg: 'rgba(255, 255, 255, 0.1)',
        },
        Table: { headerBg: '#f8f9fc', headerColor: '#4b5563' },
    },
}

ConfigProvider.config({
    holderRender: (children) => (
        <ConfigProvider locale={viVN} theme={theme}>
            {children}
        </ConfigProvider>
    ),
})

export default function AdminThemeProvider({ children }) {
    return (
        <ConfigProvider locale={viVN} theme={theme}>
            {children}
        </ConfigProvider>
    )
}
