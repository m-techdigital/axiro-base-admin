import fs from 'node:fs'

const required = [
    'src/components/base/BaseAsyncState.jsx',
    'src/components/base/BaseFormFooter.jsx',
    'src/components/base/BaseModal.jsx',
    'src/components/base/BaseFilter.jsx',
    'src/components/base/BaseTable.jsx',
    'src/components/base/BaseListView.jsx',
    'src/components/base/BaseModalForm/index.jsx',
]
const readAdminFoundation = () =>
    [
        'src/styles/primitives/admin-foundation.scss',
        ...fs
            .readdirSync('src/styles/primitives/admin-foundation')
            .filter((file) => file.endsWith('.scss'))
            .sort()
            .map((file) => `src/styles/primitives/admin-foundation/${file}`),
    ]
        .map((file) => fs.readFileSync(file, 'utf8'))
        .join('\n')

for (const file of required) {
    if (!fs.existsSync(file)) throw new Error(`Thiếu base owner: ${file}`)
}

const modal = fs.readFileSync('src/components/base/ParentBaseModal.jsx', 'utf8')
if (!modal.includes('bodyMaxHeight') || !modal.includes('onSubmit')) {
    throw new Error(
        'ParentBaseModal chưa sở hữu body scroll hoặc submit footer',
    )
}

const table = fs.readFileSync('src/components/base/BaseTable.jsx', 'utf8')
if (
    !table.includes('showTotal') ||
    !table.includes('width: column.width ?? 1')
) {
    throw new Error('BaseTable chưa sở hữu pagination/action column')
}

const foundationCss = readAdminFoundation()
const modalCss = fs.readFileSync(
    'src/styles/primitives/parent-base-modal.css',
    'utf8',
)
const modalFormCss = fs.readFileSync(
    'src/components/base/BaseModalForm/base-modal-form.css',
    'utf8',
)

for (const token of ['.base-async-state']) {
    if (!foundationCss.includes(token)) {
        throw new Error(`Thiếu CSS owner: ${token}`)
    }
}
for (const token of ['--base-modal-body-max-height', '.base-modal-body']) {
    if (!modalCss.includes(token)) {
        throw new Error(`Thiếu CSS modal owner: ${token}`)
    }
}
for (const token of ['.base-modal-form-footer', '.base-form-sections']) {
    if (!modalFormCss.includes(token)) {
        throw new Error(`Thiếu CSS form-modal owner: ${token}`)
    }
}
if (foundationCss.includes('.base-modal ')) {
    throw new Error(
        'admin-foundation.scss không được cạnh tranh modal CSS owner',
    )
}

console.log('Deep base ownership contract passed.')
