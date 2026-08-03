import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const readAdminFoundation = () =>
    [
        'src/styles/primitives/admin-foundation.scss',
        ...fs
            .readdirSync('src/styles/primitives/admin-foundation')
            .filter((file) => file.endsWith('.scss'))
            .sort()
            .map((file) => `src/styles/primitives/admin-foundation/${file}`),
    ]
        .map(read)
        .join('\n')
const fail = (message) => {
    console.error(message)
    process.exit(1)
}

const table = read('src/components/base/BaseTable.jsx')
const css = readAdminFoundation()

if (!table.includes('sticky = false')) {
    fail('BaseTable must not enable sticky headers by default.')
}

if (
    !css.includes('overflow-x: auto;') ||
    !css.includes('overflow-y: visible;')
) {
    fail(
        'BaseTable CSS must allow horizontal scrolling without a vertical scroll container.',
    )
}

if (
    !css.includes('.base-table .ant-table-body') ||
    !css.includes('max-height: none !important;')
) {
    fail('BaseTable body must not impose an implicit vertical max-height.')
}

const rowActionFiles = [
    'src/modules/products/pages/List.jsx',
    'src/modules/transactions/pages/List.jsx',
    'src/modules/generated-documents/pages/List.jsx',
    'src/modules/document-templates/columns.jsx',
    'src/modules/wallets/pages/List.jsx',
    'src/modules/payouts/pages/Index.jsx',
    'src/modules/marketplace-operations/components/operationsColumns.jsx',
    'src/modules/marketplace-trust/columns.jsx',
    'src/modules/audit-logs/pages/List.jsx',
]

for (const file of rowActionFiles) {
    const source = read(file)
    if (!source.includes('BaseIconAction')) {
        fail(`${file} must use BaseIconAction for compact row actions.`)
    }
}

console.log('Table action and scroll contract passed.')
