import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const vite = read('vite.config.js')
const main = read('src/main.jsx')
const themeProvider = read('src/app/providers/AdminThemeProvider.jsx')
const adminLayout = read('src/layouts/AdminLayout.jsx')
const login = read('src/modules/auth/pages/Login.jsx')
const loginForm = read('src/modules/auth/components/AuthLoginForm.jsx')
const transactionSections = read(
    'src/modules/transactions/components/TransactionDetailSections.jsx',
)
const notificationList = read('src/modules/notifications/pages/List.jsx')
const operationsControl = read('src/modules/operations-control/pages/Index.jsx')
const transactionDetail = read('src/modules/transactions/pages/Detail.jsx')
const transactionCommandCenter = read(
    'src/modules/transactions/components/TransactionCommandCenter.jsx',
)
const reconciliationTab = read(
    'src/modules/operations-control/components/tabs/ReconciliationTab.jsx',
)
const notificationDrawer = read(
    'src/modules/notifications/components/NotificationDetailDrawer.jsx',
)
const payout = read('src/modules/payouts/pages/Index.jsx')
const documentTemplates = read('src/modules/document-templates/pages/List.jsx')
const editor = read(
    'src/modules/document-templates/components/DocumentTemplateEditorModal.jsx',
)
const baseForm = read('src/components/base/BaseForm.jsx')
const fieldRegistry = read('src/utils/fields/fieldRegistry.jsx')
const baseFilter = read('src/components/base/BaseFilter.jsx')
const baseTable = read('src/components/base/BaseTable.jsx')
const reconciliationExport = read(
    'src/modules/operations-control/components/tabs/ReconciliationExportWorkspace.jsx',
)

const checks = [
    [
        baseForm.includes('createRenderField') &&
            fieldRegistry.includes('FIELD_ADAPTERS') &&
            !baseForm.includes('BaseFormControl') &&
            !baseForm.includes('InputNumber') &&
            !baseForm.includes('DatePicker') &&
            !baseForm.includes('RelationSelect'),
        'BaseForm must delegate field controls to the AXIRO parent field registry',
    ],
    [
        baseFilter.includes('BaseFilterControl') &&
            !baseFilter.includes('DatePicker') &&
            !baseFilter.includes('RelationSelect'),
        'BaseFilter must delegate filter controls to BaseFilterControl',
    ],
    [
        baseTable.includes('BaseTableEmptyState') &&
            !baseTable.includes('import { Empty'),
        'BaseTable empty presentation must stay in its semantic owner',
    ],
    [
        reconciliationExport.includes('lazy(') &&
            reconciliationExport.includes('ReconciliationExportProgress') &&
            reconciliationExport.includes('Đang tải trạng thái tệp xuất'),
        'reconciliation export progress must stay lazy with a visible fallback',
    ],
    [
        !main.includes('ConfigProvider') &&
            !main.includes('antd/locale') &&
            !/from\s+['"]antd['"]/.test(main),
        'application bootstrap must not eagerly import AntD runtime context',
    ],
    [
        themeProvider.includes("from 'antd/es/config-provider'") &&
            adminLayout.includes('AdminThemeProvider') &&
            login.includes('AdminThemeProvider'),
        'AntD theme/message context must stay inside lazy Login/AdminLayout owners',
    ],
    [
        !main.includes('AntApp') && !main.includes('App as AntApp'),
        'application bootstrap must not eagerly mount unused AntD App context',
    ],
    [
        !/return\s+['"]antd-core['"]/.test(vite),
        'vite config must not force every AntD module into antd-core',
    ],
    [
        vite.includes("id.includes('/antd/')") &&
            vite.includes("id.includes('/@ant-design/')") &&
            vite.includes("id.includes('/rc-')") &&
            /id\.includes\('\/rc-'\)[\s\S]*?return undefined/.test(vite),
        'AntD, icons and rc-* packages must bypass the generic shared vendor chunk',
    ],
    [
        transactionDetail.includes('lazy(') &&
            transactionDetail.includes('TransactionDetailModals'),
        'transaction detail modals must stay lazy',
    ],
    [
        !login.includes('BaseForm') &&
            login.includes('AuthLoginForm') &&
            loginForm.includes("from 'antd/es/form'") &&
            loginForm.includes("from 'antd/es/input'") &&
            loginForm.includes('BaseButton'),
        'login must use a lightweight auth form instead of the full BaseForm graph',
    ],
    [
        transactionSections.includes('lazy(') &&
            transactionSections.includes('TransactionPaymentPanel') &&
            transactionSections.includes('TransactionDocumentPanel') &&
            transactionSections.includes('TransactionTimelinePanel') &&
            transactionSections.includes('TransactionAdminActionsPanel'),
        'transaction detail presentation panels must stay route-local lazy owners',
    ],
    [
        notificationList.includes('lazy(') &&
            notificationList.includes('NotificationDetailDrawer') &&
            notificationList.includes('center.detail || center.detailLoading'),
        'notification detail drawer must load only when detail is requested',
    ],
    [
        operationsControl.includes('lazy(') &&
            operationsControl.includes(
                "import('../components/tabs/HoldsTab')",
            ) &&
            operationsControl.includes(
                "import('../components/tabs/QueuesTab')",
            ) &&
            operationsControl.includes(
                "import('../components/tabs/ReconciliationTab')",
            ) &&
            operationsControl.includes('hasOpenModal'),
        'operations tabs and modals must stay lazy and demand-loaded',
    ],
    [
        transactionCommandCenter.includes('TransactionCommandGuidance') &&
            transactionCommandCenter.includes('TransactionCommandWorkflow') &&
            transactionCommandCenter.includes('TransactionPendingPayments') &&
            transactionCommandCenter.includes('Đang tải tiến độ hồ sơ'),
        'transaction command center heavy presentation owners must stay lazy with visible fallbacks',
    ],
    [
        transactionDetail.includes(
            "import('../components/TransactionCommandCenter')",
        ) &&
            transactionDetail.includes(
                "import('../components/TransactionDetailSections')",
            ),
        'transaction detail command center and sections must stay lazy route owners',
    ],
    [
        reconciliationTab.includes("import('./ReconciliationSummary')") &&
            reconciliationTab.includes(
                "import('./ReconciliationExportWorkspace')",
            ) &&
            reconciliationTab.includes('destroyOnHidden'),
        'reconciliation summary/export workspaces must stay split and demand-loaded',
    ],
    [
        notificationDrawer.includes('BaseDrawer') &&
            !notificationDrawer.includes('Descriptions') &&
            !notificationDrawer.includes('Timeline') &&
            !notificationDrawer.includes('Input.TextArea'),
        'notification drawer must avoid pulling heavy AntD presentation controls',
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
