import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const fail = (message) => {
    console.error(message)
    process.exit(1)
}

const table = read('src/components/base/BaseTable.jsx')
const css = read('src/styles/primitives/admin-foundation.css')

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
    'src/modules/contracts/pages/List.jsx',
    'src/modules/transactions/pages/List.jsx',
    'src/modules/generated-documents/pages/List.jsx',
    'src/modules/document-templates/pages/List.jsx',
    'src/modules/wallets/pages/List.jsx',
    'src/modules/payouts/pages/Index.jsx',
    'src/modules/marketplace-operations/pages/Index.jsx',
    'src/modules/marketplace-trust/pages/Index.jsx',
    'src/modules/audit-logs/pages/List.jsx',
]

for (const file of rowActionFiles) {
    const source = read(file)
    if (!source.includes('BaseIconAction')) {
        fail(`${file} must use BaseIconAction for compact row actions.`)
    }
}

console.log('Table action and scroll contract passed.')
