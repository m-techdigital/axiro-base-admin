import fs from 'node:fs'
const files = [
    'src/modules/payouts/pages/Index.jsx',
    'src/modules/payouts/service.js',
    'src/routes/adminRoutes.jsx',
    'src/config/adminMenu.jsx',
]
const text = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
const missing = [
    '/seller-verifications',
    '/payout-accounts',
    '/withdrawals',
    'Xác minh và chi trả',
].filter((x) => !text.includes(x))
if (missing.length) {
    console.error(`Thiếu Admin payout flow: ${missing.join(', ')}`)
    process.exit(1)
}
console.log('Admin payout flow contract OK')
