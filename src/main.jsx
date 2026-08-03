import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, App as AntApp } from 'antd'
import viVN from 'antd/locale/vi_VN'
import 'antd/dist/reset.css'
import './index.css'
import App from './App'
import { AuthProvider } from './hooks/useAuth'

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

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConfigProvider locale={viVN} theme={theme}>
            <AntApp>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </AntApp>
        </ConfigProvider>
    </React.StrictMode>,
)
