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
