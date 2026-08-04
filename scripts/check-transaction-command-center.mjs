import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const detail = read('src/modules/transactions/pages/Detail.jsx')
const center = read(
    'src/modules/transactions/components/TransactionCommandCenter.jsx',
)
const guidance = read(
    'src/modules/transactions/components/TransactionCommandGuidance.jsx',
)
const workflow = read(
    'src/modules/transactions/components/TransactionCommandWorkflow.jsx',
)
const payments = read(
    'src/modules/transactions/components/TransactionPendingPayments.jsx',
)

if (!detail.includes('TransactionCommandCenter'))
    throw new Error('Transaction detail chưa dùng command center')
for (const key of ['next_action', 'blocked_reason', 'workflow_checklist'])
    if (!center.includes(key)) throw new Error(`Command center thiếu ${key}`)
for (const owner of [
    'TransactionCommandGuidance',
    'TransactionCommandWorkflow',
    'TransactionPendingPayments',
]) {
    if (!center.includes(`lazy(`) || !center.includes(owner))
        throw new Error(`Command center chưa lazy owner ${owner}`)
}
if (!guidance.includes('formatCurrency'))
    throw new Error('Guidance owner thiếu money presentation')
if (!workflow.includes('Progress'))
    throw new Error('Workflow owner thiếu progress presentation')
if (!payments.includes('BaseConfirmActionButton'))
    throw new Error('Pending payment owner thiếu confirm action')
console.log('transaction command center: PASS')
