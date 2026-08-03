import fs from 'node:fs'
const detail = fs.readFileSync(
    'src/modules/transactions/pages/Detail.jsx',
    'utf8',
)
const component = fs.readFileSync(
    'src/modules/transactions/components/TransactionCommandCenter.jsx',
    'utf8',
)
if (!detail.includes('TransactionCommandCenter'))
    throw new Error('Transaction detail chưa dùng command center')
for (const key of ['next_action', 'blocked_reason', 'workflow_checklist'])
    if (!component.includes(key)) throw new Error(`Command center thiếu ${key}`)
console.log('transaction command center: PASS')
