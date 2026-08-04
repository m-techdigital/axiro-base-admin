import fs from 'node:fs'
const source = fs.readFileSync(
    'src/modules/transactions/components/TransactionDetailSections.jsx',
    'utf8',
)
const failures = []
for (const owner of [
    'TransactionPaymentPanel',
    'TransactionDocumentPanel',
    'TransactionTimelinePanel',
    'TransactionAdminActionsPanel',
]) {
    if (
        !source.includes(`lazy(`) ||
        !source.includes(`import('./detail/${owner}')`)
    )
        failures.push(`Thiếu lazy owner ${owner}`)
}
for (const token of [
    'activePanel',
    'destroyOnHidden',
    'items={items}',
    'onChange={setActivePanel}',
])
    if (!source.includes(token))
        failures.push(`Thiếu active-panel contract ${token}`)
if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log('Transaction detail active-panel ownership PASS.')
