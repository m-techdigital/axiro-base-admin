import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const required = [
    'src/components/base/BaseTabs.jsx',
    'src/components/base/BaseStatusSummaryBar.jsx',
    'src/modules/payment-settings/pages/Index.jsx',
]

for (const file of required) {
    if (!fs.existsSync(path.join(root, file))) {
        throw new Error(`Missing operational foundation: ${file}`)
    }
}

const page = fs.readFileSync(
    path.join(root, 'src/modules/payment-settings/pages/Index.jsx'),
    'utf8',
)
for (const token of [
    'BaseTabs',
    'BaseStatusSummaryBar',
    'BaseFormFooter',
    'service.history()',
    'service.activate',
]) {
    if (!page.includes(token))
        throw new Error(`Payment settings is missing ${token}`)
}

const service = fs.readFileSync(
    path.join(root, 'src/modules/payment-settings/service.js'),
    'utf8',
)
for (const endpoint of ['/payment-settings/history', '/activate']) {
    if (!service.includes(endpoint))
        throw new Error(`Payment settings service is missing ${endpoint}`)
}

console.log('Admin operational readiness checks passed.')
