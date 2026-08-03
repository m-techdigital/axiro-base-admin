import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const required = [
    'src/components/base/BaseView.jsx',
    'src/utils/fieldRenderer.jsx',
]
for (const file of required) {
    if (!fs.existsSync(path.join(root, file)))
        throw new Error(`Missing ${file}`)
}
const barrel = fs.readFileSync(
    path.join(root, 'src/components/base/index.js'),
    'utf8',
)
if (!barrel.includes('BaseView')) throw new Error('BaseView is not exported')
const detail = [
    'src/modules/transactions/pages/Detail.jsx',
    'src/modules/transactions/components/TransactionDetailSections.jsx',
]
    .map((file) => fs.readFileSync(path.join(root, file), 'utf8'))
    .join('\n')
if (!detail.includes('<BaseView'))
    throw new Error('Transaction detail has not adopted BaseView')
if (detail.includes('<Descriptions'))
    throw new Error('Legacy transaction Descriptions remains')
const renderer = fs.readFileSync(
    path.join(root, 'src/utils/fieldRenderer.jsx'),
    'utf8',
)
for (const type of [
    'money',
    'datetime',
    'option_tag',
    'relation',
    'editor',
    'image',
]) {
    if (!renderer.includes(`case '${type}'`))
        throw new Error(`Missing renderer type: ${type}`)
}
console.log('Parent view foundation checks passed.')
