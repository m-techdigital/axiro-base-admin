import fs from 'node:fs'

const failures = []
const read = (file) => fs.readFileSync(file, 'utf8')

const parentModal = read('src/components/base/ParentBaseModal.jsx')
if (parentModal.includes('base-modal.scss')) {
    failures.push(
        'ParentBaseModal không được import SCSS không tồn tại trong Mini.',
    )
}

const indexCss = read('src/index.css')
const firstRule = indexCss
    .split(/\r?\n/)
    .findIndex((line) => line.trim() && !line.trim().startsWith('@import'))
const lateImport = indexCss
    .split(/\r?\n/)
    .findIndex(
        (line, index) => index > firstRule && line.trim().startsWith('@import'),
    )
if (lateImport >= 0) {
    failures.push('Tất cả @import CSS phải đứng trước rule CSS đầu tiên.')
}
if (
    !indexCss.includes("@import './styles/primitives/parent-base-modal.css';")
) {
    failures.push('Thiếu stylesheet modal đã chuyển đổi từ AXIRO cha.')
}

const requiredPatterns = new Map([
    ['src/hooks/useRelationOptions.jsx', ['labelRef', '[service]']],
    ['src/modules/contracts/pages/Form.jsx', ['[f, id]']],
    [
        'src/modules/marketplace-operations/pages/Index.jsx',
        ['useCallback', '[load]'],
    ],
    [
        'src/modules/marketplace-trust/pages/Index.jsx',
        ['useCallback', '[load]'],
    ],
    ['src/modules/payouts/pages/Index.jsx', ['useCallback', '[load]']],
    ['src/modules/transactions/pages/Detail.jsx', ['useCallback', '[load]']],
    [
        'src/modules/wallets/pages/List.jsx',
        ['useCallback', 'keywordRef', '[load]'],
    ],
])

for (const [file, patterns] of requiredPatterns) {
    const source = read(file)
    for (const pattern of patterns) {
        if (!source.includes(pattern)) {
            failures.push(`${file} thiếu runtime hook contract: ${pattern}`)
        }
    }
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}

console.log(
    'Admin runtime closure passed: CSS imports, modal stylesheet, and hook dependencies are stable.',
)
