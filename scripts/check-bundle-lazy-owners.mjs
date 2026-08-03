import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const vite = read('vite.config.js')
const transactionDetail = read('src/modules/transactions/pages/Detail.jsx')
const payout = read('src/modules/payouts/pages/Index.jsx')
const documentTemplates = read('src/modules/document-templates/pages/List.jsx')
const editor = read(
    'src/modules/document-templates/components/DocumentTemplateEditorModal.jsx',
)

const checks = [
    [
        !/return\s+['"]antd-core['"]/.test(vite),
        'vite config must not force every AntD module into antd-core',
    ],
    [
        transactionDetail.includes('lazy(') &&
            transactionDetail.includes('TransactionDetailModals'),
        'transaction detail modals must stay lazy',
    ],
    [
        payout.includes('lazy(') && payout.includes('PayoutDecisionModal'),
        'payout decision modal must stay lazy',
    ],
    [
        documentTemplates.includes('lazy(') &&
            documentTemplates.includes('DocumentTemplateEditorModal'),
        'document template editor must stay lazy',
    ],
    [
        editor.includes('BaseForm') && editor.includes('BaseModal'),
        'document editor must own its heavy form/modal dependencies',
    ],
    [
        !documentTemplates.includes('BaseForm') &&
            !documentTemplates.includes('BaseModal'),
        'document template list must not pull editor dependencies eagerly',
    ],
]

const failed = checks.filter(([ok]) => !ok).map(([, message]) => message)
if (failed.length) {
    console.error(`Bundle lazy owner guard failed:\n- ${failed.join('\n- ')}`)
    process.exit(1)
}
console.log('Bundle lazy owner guard passed.')
