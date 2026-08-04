import fs from 'node:fs'

const sections = fs.readFileSync(
    'src/modules/transactions/components/TransactionDetailSections.jsx',
    'utf8',
)
const detailPage = fs.readFileSync(
    'src/modules/transactions/pages/Detail.jsx',
    'utf8',
)
const reconciliation = fs.readFileSync(
    'src/modules/operations-control/components/tabs/ReconciliationTab.jsx',
    'utf8',
)
const notificationDrawer = fs.readFileSync(
    'src/modules/notifications/components/NotificationDetailDrawer.jsx',
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
        !sections.includes('lazy(') ||
        !sections.includes(`import('./detail/${owner}')`)
    )
        failures.push(`Thiếu lazy owner ${owner}`)
}
for (const token of [
    'activePanel',
    'destroyOnHidden',
    'items={items}',
    'onChange={setActivePanel}',
])
    if (!sections.includes(token))
        failures.push(`Thiếu active-panel contract ${token}`)

for (const owner of ['TransactionCommandCenter', 'TransactionDetailSections']) {
    if (
        !detailPage.includes('lazy(') ||
        !detailPage.includes(`import('../components/${owner}')`)
    )
        failures.push(`Transaction Detail route phải lazy ${owner}`)
}
for (const owner of [
    'ReconciliationSummary',
    'ReconciliationExportWorkspace',
]) {
    if (
        !reconciliation.includes('lazy(') ||
        !reconciliation.includes(`import('./${owner}')`)
    )
        failures.push(`Reconciliation phải lazy ${owner}`)
}
if (!reconciliation.includes('destroyOnHidden'))
    failures.push('Reconciliation workspace phải destroy panel ẩn')
for (const forbidden of ['Descriptions', 'Timeline', 'Input.TextArea', 'Tag']) {
    if (notificationDrawer.includes(forbidden))
        failures.push(`Notification drawer không được kéo ${forbidden}`)
}
if (!notificationDrawer.includes('BaseDrawer'))
    failures.push('Notification drawer phải giữ BaseDrawer owner')

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log('Admin route panel ownership PASS.')
