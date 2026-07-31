import fs from 'node:fs'
const files = [
    'src/routes/adminRoutes.jsx',
    'src/config/adminMenu.jsx',
    'src/modules/marketplace-operations/pages/Index.jsx',
]
const text = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
const missing = [
    'marketplace-operations',
    'Vận hành Marketplace',
    'Chính sách phí',
    'Trung tâm yêu cầu',
    'Biên bản hiện trạng',
].filter((t) => !text.includes(t))
if (missing.length) {
    console.error(missing.map((t) => `Thiếu ${t}`).join('\n'))
    process.exit(1)
}
console.log('Admin marketplace closure contract OK')
