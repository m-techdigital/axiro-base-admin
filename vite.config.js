import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { cwd } from 'node:process'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, cwd(), '')
    const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8001'

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(
                    fileURLToPath(new URL('.', import.meta.url)),
                    'src',
                ),
            },
        },
        build: {
            manifest: true,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (!id.includes('node_modules')) return undefined
                        if (
                            id.includes('/react/') ||
                            id.includes('/react-dom/') ||
                            id.includes('/react-router')
                        )
                            return 'react-vendor'
                        // Keep AntD, icons and rc-* packages route-local. Returning
                        // undefined here is required; otherwise the generic vendor branch
                        // below would still force them into one shared initial dependency.
                        if (
                            id.includes('/antd/') ||
                            id.includes('/@ant-design/') ||
                            id.includes('/rc-')
                        )
                            return undefined
                        if (id.includes('/axios/')) return 'http-vendor'
                        if (id.includes('/dayjs/')) return 'date-vendor'
                        return 'vendor'
                    },
                },
            },
        },
        server: {
            proxy: {
                '/api': {
                    target: proxyTarget,
                    changeOrigin: true,
                },
                '/storage': {
                    target: proxyTarget,
                    changeOrigin: true,
                },
            },
        },
    }
})
