import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const required = [
    'src/components/base/BaseModal.jsx',
    'src/components/base/BaseFilter.jsx',
    'src/components/base/BaseIconAction.jsx',
    'src/modules/payments/pages/List.jsx',
    'src/modules/listings/pages/List.jsx',
    'src/modules/disputes/pages/List.jsx',
    'src/modules/wallet-deposits/pages/List.jsx',
]

for (const file of required) {
    if (!fs.existsSync(file)) {
        throw new Error(`Thiếu foundation file: ${file}`)
    }
}

const modal = read('src/components/base/ParentBaseModal.jsx')
const modalCss = read('src/styles/primitives/parent-base-modal.css')
if (
    !modal.includes('onCancel={onCancel}') ||
    !modal.includes('resolvedFooter') ||
    !modalCss.includes('.ant-modal-close')
) {
    throw new Error('BaseModal chưa đồng bộ close/footer theo source cha')
}

const filter = read('src/components/base/BaseFilter.jsx')
if (
    !filter.includes('base-filter--compact') ||
    !filter.includes('showLabels = false')
) {
    throw new Error('BaseFilter chưa dùng compact field ownership')
}

for (const file of required.slice(3)) {
    const source = read(file)
    if (!source.includes('BaseListView') || !source.includes('BaseFilter')) {
        throw new Error(`${file} chưa dùng list/filter base`)
    }
    if (/Input\.Search|<Card>|<PageHeader/.test(source)) {
        throw new Error(`${file} còn tự dựng list/filter surface`)
    }
}

console.log('Base interaction parity passed.')
