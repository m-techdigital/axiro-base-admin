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

const viteConfig = fs.readFileSync(path.join(root, 'vite.config.js'), 'utf8')
if (viteConfig.includes("return 'antd-vendor'"))
    failures.push('bundle ownership: monolithic antd-vendor must not return.')
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
