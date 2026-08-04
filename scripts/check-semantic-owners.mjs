import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const failures = []
const resolver = await import(
    pathToFileURL(
        path.join(root, 'src/hooks/relation/relationConfigResolver.js'),
    ).href
)

if (JSON.stringify(resolver.normalizeRelationParams(null)) !== '{}') {
    failures.push(
        'relationConfigResolver: null params must normalize to an empty object.',
    )
}
if (resolver.normalizeRelationParams('x').value !== 'x') {
    failures.push(
        'relationConfigResolver: scalar params must normalize to { value }.',
    )
}
if (!resolver.areRelationDependenciesReady({ customer_id: 1 })) {
    failures.push(
        'relationConfigResolver: populated dependencies must be ready.',
    )
}
if (resolver.areRelationDependenciesReady({ customer_id: '' })) {
    failures.push(
        'relationConfigResolver: empty required dependency must not be ready.',
    )
}
if (!resolver.shallowEqualRelationParams({ a: 1 }, { a: 1 })) {
    failures.push(
        'relationConfigResolver: equal param objects must compare equal.',
    )
}

const hook = fs.readFileSync(
    path.join(root, 'src/hooks/useRelationOptions.jsx'),
    'utf8',
)
if (hook.split(/\r?\n/).length > 520) {
    failures.push(
        'src/hooks/useRelationOptions.jsx: hook orchestration must remain below 520 lines.',
    )
}
for (const owner of [
    './relation/relationConfigResolver',
    './relation/relationOptionCache',
    './relation/relationOptionNormalizer',
]) {
    if (!hook.includes(owner))
        failures.push(`useRelationOptions: missing owner ${owner}.`)
}
if (/useLegacyRelationOptions|configsOrService\s*\.\s*list/.test(hook)) {
    failures.push(
        'useRelationOptions: legacy relation owner must not be restored.',
    )
}

const detail = fs.readFileSync(
    path.join(root, 'src/modules/transactions/pages/Detail.jsx'),
    'utf8',
)
if (detail.split(/\r?\n/).length > 150) {
    failures.push(
        'transactions/pages/Detail.jsx: route orchestration must remain below 150 lines.',
    )
}
if (!detail.includes('TransactionDetailSections')) {
    failures.push(
        'transactions/pages/Detail.jsx: presentation sections owner is missing.',
    )
}

const loginPage = fs.readFileSync(
    path.join(root, 'src/modules/auth/pages/Login.jsx'),
    'utf8',
)
const loginForm = fs.readFileSync(
    path.join(root, 'src/modules/auth/components/AuthLoginForm.jsx'),
    'utf8',
)
if (loginPage.includes('BaseForm') || !loginPage.includes('AuthLoginForm')) {
    failures.push('auth login: lightweight form owner must replace BaseForm.')
}
for (const owner of ['antd/es/form', 'antd/es/input', 'BaseButton']) {
    if (!loginForm.includes(owner)) {
        failures.push(`auth login: missing direct lightweight owner ${owner}.`)
    }
}

const detailSections = fs.readFileSync(
    path.join(
        root,
        'src/modules/transactions/components/TransactionDetailSections.jsx',
    ),
    'utf8',
)
for (const owner of [
    'TransactionPaymentPanel',
    'TransactionDocumentPanel',
    'TransactionTimelinePanel',
    'TransactionAdminActionsPanel',
]) {
    if (!detailSections.includes(`lazy(`) || !detailSections.includes(owner)) {
        failures.push(`transaction detail: ${owner} must stay lazy.`)
    }
}

const notificationList = fs.readFileSync(
    path.join(root, 'src/modules/notifications/pages/List.jsx'),
    'utf8',
)
if (
    !notificationList.includes('lazy(') ||
    !notificationList.includes('NotificationDetailDrawer')
) {
    failures.push('notifications: detail drawer must remain lazy.')
}

const operationsPage = fs.readFileSync(
    path.join(root, 'src/modules/operations-control/pages/Index.jsx'),
    'utf8',
)
for (const owner of [
    'HoldsTab',
    'QueuesTab',
    'ReconciliationTab',
    'OperationsModals',
]) {
    if (!operationsPage.includes(owner) || !operationsPage.includes('lazy(')) {
        failures.push(`operations control: ${owner} must remain lazy.`)
    }
}

const documentForm = fs.readFileSync(
    path.join(root, 'src/modules/document-templates/formConfig.jsx'),
    'utf8',
)
const generatedOptions = fs.readFileSync(
    path.join(root, 'src/generated/marketplaceOptions.js'),
    'utf8',
)
if (!documentForm.includes('MARKETPLACE_DOCUMENT_TEMPLATE_STATUSES'))
    failures.push(
        'document templates: shared generated status contract is missing.',
    )
for (const status of ['draft', 'published', 'deprecated']) {
    if (!generatedOptions.includes(`value: '${status}'`))
        failures.push(`document templates: missing ${status} status.`)
}
const documentColumns = fs.readFileSync(
    path.join(root, 'src/modules/document-templates/columns.jsx'),
    'utf8',
)
if (!documentColumns.includes('generated_documents_count'))
    failures.push('document templates: used count column is missing.')
const crudSmoke = fs.readFileSync(
    path.join(root, 'scripts/e2e-browser-crud.mjs'),
    'utf8',
)
for (const marker of [
    '/products/new',
    '/transactions/new',
    '/customers/new',
    '/document-templates',
    '/payouts',
]) {
    if (!crudSmoke.includes(marker))
        failures.push(`admin CRUD smoke: missing ${marker}.`)
}

for (const marker of [
    'ADMIN_E2E_REQUIRE_DOCUMENT_VERSION_MUTATION',
    'clickRowAction(',
    'supersedes_template_id',
    'Document template immutable version mutation thiếu issued template fixture',
]) {
    if (!crudSmoke.includes(marker))
        failures.push(
            `admin CRUD smoke: missing strict document version marker ${marker}.`,
        )
}

const viteConfig = fs.readFileSync(path.join(root, 'vite.config.js'), 'utf8')
if (viteConfig.includes("return 'antd-vendor'"))
    failures.push('bundle ownership: monolithic antd-vendor must not return.')

if (
    !viteConfig.includes("id.includes('/antd/')") ||
    !viteConfig.includes("id.includes('/@ant-design/')") ||
    !viteConfig.includes("id.includes('/rc-')")
) {
    failures.push(
        'bundle ownership: AntD/@ant-design/rc packages must bypass the generic vendor chunk.',
    )
}
for (const chunk of ['antd-vendor', 'antd-core', 'antd-icons', 'antd-rc']) {
    if (viteConfig.includes(`return '${chunk}'`))
        failures.push(
            `bundle ownership: forced ${chunk} prevents route-local tree splitting.`,
        )
}
const routerSource = fs.readFileSync(
    path.join(root, 'src/app/router/index.jsx'),
    'utf8',
)
if (!routerSource.includes("lazy(() => import('../../layouts/AdminLayout'))"))
    failures.push('bundle ownership: AdminLayout must be lazy-loaded.')
if (
    !routerSource.includes(
        "lazy(() => import('../../modules/auth/pages/Login'))",
    )
)
    failures.push('bundle ownership: Login must be lazy-loaded.')
if (viteConfig.includes("return 'antd-core'"))
    failures.push(
        'bundle ownership: monolithic antd-core prevents lazy-route splitting.',
    )
const actionCenter = fs.readFileSync(
    path.join(root, 'src/modules/action-center/pages/Index.jsx'),
    'utf8',
)
for (const queue of ['rental_deposits', 'payouts', 'holds']) {
    if (!actionCenter.includes(`data?.${queue}`))
        failures.push(`action center: missing ${queue} queue.`)
}
const rentalPresentation = fs.readFileSync(
    path.join(root, 'src/modules/transactions/config/detailPresentation.js'),
    'utf8',
)
for (const label of [
    'Tiền thuê',
    'Tiền cọc',
    'Cần thanh toán ban đầu',
    'Khấu trừ tiền cọc',
    'Cọc dự kiến hoàn lại',
]) {
    if (!rentalPresentation.includes(label))
        failures.push(`rental detail: missing ${label}.`)
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log(
    'Semantic owner guard passed: relation resolver and transaction detail owners are stable.',
)
