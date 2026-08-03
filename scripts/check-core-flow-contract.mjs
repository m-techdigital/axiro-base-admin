import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const assert = (condition, message) => {
    if (!condition) throw new Error(message)
}

const routes = read('src/routes/adminRoutes.jsx')
const transactionForm = read('src/modules/transactions/formConfig.js')
const relationHook = read('src/hooks/useRelationOptions.jsx')
const payoutPage = read('src/modules/payouts/pages/Index.jsx')
const payoutService = read('src/modules/payouts/service.js')

for (const route of [
    '/transactions',
    '/payouts',
    '/wallets',
    '/notifications',
]) {
    assert(routes.includes(route), `Thiếu route vận hành bắt buộc: ${route}`)
}

assert(
    transactionForm.includes("type: 'relation'"),
    'Form giao dịch phải dùng relation config canonical.',
)
assert(
    transactionForm.includes("module: 'products'"),
    'Form giao dịch thiếu relation product.',
)
assert(
    transactionForm.includes("module: 'customers'"),
    'Form giao dịch thiếu relation customer.',
)
assert(
    !relationHook.includes('useLegacyRelationOptions'),
    'Không được khôi phục relation hook legacy.',
)
assert(
    payoutPage.includes('usePayoutCenter'),
    'Trang payout phải giữ orchestration trong hook owner.',
)
for (const action of ['approve', 'reject', 'paid']) {
    assert(
        payoutService.includes(`${action}:`),
        `Payout service thiếu action ${action}.`,
    )
}

console.log('Core admin flow contract: PASS')
