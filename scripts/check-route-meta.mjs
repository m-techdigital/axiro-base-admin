import fs from 'node:fs'
const routes = fs.readFileSync('src/routes/adminRoutes.jsx', 'utf8')
const meta = fs.readFileSync('src/routes/meta.js', 'utf8')
const required = [
    'products',
    'transactions',
    'customers',
    'payments',
    'wallets',
    'wallet-deposits',
    'payouts',
    'audit-logs',
    'document-templates',
    'generated-documents',
]
const missing = required.filter(
    (path) =>
        !routes.includes(`path: '${path}'`) ||
        (!meta.toLowerCase().includes(path.replaceAll('-', '_')) &&
            !meta.includes(`/${path}`)),
)
if (missing.length) {
    console.error(`Thiếu route/meta: ${missing.join(', ')}`)
    process.exit(1)
}
console.log('Route metadata OK')
