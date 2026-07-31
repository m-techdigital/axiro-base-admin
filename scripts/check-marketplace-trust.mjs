import fs from 'node:fs'

const sources = [
    '../src/App.jsx',
    '../src/layouts/AdminLayout.jsx',
    '../src/configs/adminMenu.jsx',
    '../src/routes/adminRoutes.jsx',
    '../src/modules/marketplace-trust/pages/Index.jsx',
].map((relativePath) =>
    fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8'),
)

const combined = sources.join('\n')
const failures = []

for (const token of [
    'marketplace-trust',
    'Niềm tin và nội dung',
    'Đánh giá',
    'Nội dung',
    'Rủi ro',
]) {
    if (!combined.includes(token)) {
        failures.push(`Thiếu ${token}`)
    }
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}

console.log('Admin marketplace trust contract OK')
