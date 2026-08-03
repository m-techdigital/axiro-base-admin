import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const failures = []
const tracked = execSync('git ls-files', { encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)

for (const file of tracked) {
    if (/(^|[-_])v\d{2,}([-_.]|$)/i.test(path.basename(file))) {
        failures.push(
            `${file}: không dùng tên file đánh dấu V55/V66 hoặc version marker tạm.`,
        )
    }
}

const requiredTransactionDetailOwners = [
    'src/modules/transactions/hooks/useTransactionDetail.js',
    'src/modules/transactions/components/TransactionDetailModals.jsx',
    'src/modules/transactions/config/detailPresentation.js',
]
for (const file of requiredTransactionDetailOwners) {
    if (!fs.existsSync(file)) {
        failures.push(`${file}: thiếu owner đã tách khỏi transaction detail.`)
    }
}

const detailOwnerFiles = [
    'src/modules/transactions/pages/Detail.jsx',
    'src/modules/transactions/components/TransactionDetailSections.jsx',
    ...fs
        .readdirSync('src/modules/transactions/components/detail')
        .map((file) => `src/modules/transactions/components/detail/${file}`),
]
const detail = detailOwnerFiles
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n')
const detailPage = fs.readFileSync(
    'src/modules/transactions/pages/Detail.jsx',
    'utf8',
)
if (detailPage.split(/\r?\n/).length > 150) {
    failures.push(
        'src/modules/transactions/pages/Detail.jsx: route page không được phình lại quá 150 dòng.',
    )
}
for (const needle of [
    'useTransactionDetail(',
    'TransactionDetailModals',
    'buildTransactionDetailFields',
]) {
    if (!detail.includes(needle)) {
        failures.push(
            `src/modules/transactions/pages/Detail.jsx: thiếu owner contract ${needle}.`,
        )
    }
}
if ((detail.match(/title=\{item\.label\}/g) || []).length > 1) {
    failures.push(
        'src/modules/transactions/pages/Detail.jsx: List.Item.Meta bị lặp title item.label.',
    )
}

const runtime = fs.readFileSync(
    'scripts/check-admin-runtime-closure.mjs',
    'utf8',
)
if (
    !runtime.includes(
        'src/modules/transactions/pages/Detail.jsx|src/modules/transactions/hooks/useTransactionDetail.js',
    )
) {
    failures.push(
        'scripts/check-admin-runtime-closure.mjs: chưa guard transaction detail hook dependency.',
    )
}

for (const file of tracked.filter((entry) => entry.startsWith('src/'))) {
    if (!/\.(js|jsx|ts|tsx|json)$/.test(file)) continue
    const source = fs.readFileSync(file, 'utf8')
    if (
        /\b(change_department|assign_role|manage_organization|change_manager|company_id|department_id|payroll|accounting|reports|crm|reservation|opportunity|inventory|employee|employees|attendance|payslip|salary|recruitment|resignation|onboarding|offboarding)\b/i.test(
            source,
        )
    ) {
        failures.push(
            `${file}: Mini admin không được giữ parent-only runtime scope.`,
        )
    }
}

for (const file of [
    'src/hooks/relation/relationConfigResolver.js',
    'src/hooks/relation/relationOptionCache.js',
    'src/hooks/relation/relationOptionNormalizer.js',
    'src/modules/transactions/components/TransactionDetailSections.jsx',
    'src/modules/transactions/components/detail/TransactionPaymentPanel.jsx',
    'src/modules/transactions/components/detail/TransactionDocumentPanel.jsx',
    'src/modules/transactions/components/detail/TransactionTimelinePanel.jsx',
    'src/modules/transactions/components/detail/TransactionAdminActionsPanel.jsx',
]) {
    if (!fs.existsSync(file)) failures.push(`${file}: missing extracted owner.`)
}
const relationHook = fs.readFileSync('src/hooks/useRelationOptions.jsx', 'utf8')
if (relationHook.split(/\r?\n/).length > 520) {
    failures.push(
        'src/hooks/useRelationOptions.jsx: relation orchestration must remain below 520 lines.',
    )
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}

console.log(
    'Maintainability guard passed: transaction detail owners, temp file names and runtime split stay clean.',
)
