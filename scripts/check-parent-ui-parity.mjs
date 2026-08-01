import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const requiredFiles = [
    'src/components/base/BaseFilter.jsx',
    'src/components/base/BaseActionGroup.jsx',
    'src/components/base/BaseConfirmActionButton.jsx',
    'src/components/base/BaseDeleteButton.jsx',
    'src/components/base/BaseFormPage.jsx',
    'src/styles/tokens/breakpoints.css',
    'src/styles/tokens/layout.css',
    'src/styles/primitives/responsive.css',
    '.prettierrc',
]

const failures = []
for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(root, file))) {
        failures.push(`Thiếu foundation: ${file}`)
    }
}

const coreLists = [
    'src/modules/customers/pages/List.jsx',
    'src/modules/products/pages/List.jsx',
    'src/modules/contracts/pages/List.jsx',
    'src/modules/transactions/pages/List.jsx',
]

for (const file of coreLists) {
    const source = fs.readFileSync(path.join(root, file), 'utf8')
    for (const owner of ['BaseFilter', 'BaseListView', 'BasePageHeader']) {
        if (!source.includes(owner)) {
            failures.push(`${file} chưa dùng ${owner}`)
        }
    }

    if (source.includes('Input.Search') || source.includes('<Card')) {
        failures.push(`${file} còn tự dựng filter/card list`)
    }
}

const css = fs.readFileSync(
    path.join(root, 'src/styles/primitives/admin-foundation.css'),
    'utf8',
)
for (const selector of [
    '.base-filter-row',
    '.base-filter-actions',
    '.base-action-group',
    '.base-list-view__filters',
]) {
    if (!css.includes(selector)) {
        failures.push(`Thiếu selector foundation: ${selector}`)
    }
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}

console.log('Parent UI parity contract passed.')
