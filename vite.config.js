import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        rolldownOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return

                    if (
                        id.includes('maplibre-gl') ||
                        id.includes('react-map-gl') ||
                        id.includes('leaflet') ||
                        id.includes('react-leaflet')
                    ) {
                        return 'vendor-map'
                    }

                    if (id.includes('@fullcalendar')) {
                        return 'vendor-calendar'
                    }

                    if (id.includes('recharts')) {
                        return 'vendor-charts'
                    }

                    if (id.includes('@tiptap')) {
                        return 'vendor-editor'
                    }

                    if (
                        id.includes('@rc-component') ||
                        id.includes('/rc-') ||
                        id.includes('\\rc-')
                    ) {
                        return 'vendor-antd-base'
                    }

                    if (id.includes('antd') || id.includes('@ant-design')) {
                        return 'vendor-antd'
                    }

                    if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                        return 'vendor-react'
                    }

                    if (id.includes('xlsx')) {
                        return 'vendor-xlsx'
                    }

                    if (
                        id.includes('axios') ||
                        id.includes('dayjs') ||
                        id.includes('lodash') ||
                        id.includes('classnames')
                    ) {
                        return 'vendor-utils'
                    }

                    return 'vendor'
                },
            },
        },
    },
})
