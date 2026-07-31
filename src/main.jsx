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
        colorPrimary: '#5b5bd6',
        colorInfo: '#5b5bd6',
        borderRadius: 10,
        colorBgLayout: '#f4f6fa',
        colorText: '#20242c',
        fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    components: {
        Layout: { headerBg: '#ffffff', siderBg: '#111827' },
        Menu: {
            darkItemBg: '#111827',
            darkItemSelectedBg: '#3730a3',
            darkItemHoverBg: '#1f2937',
        },
        Table: { headerBg: '#f8f9fc', headerColor: '#4b5563' },
    },
}

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
