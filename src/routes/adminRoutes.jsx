import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const ActionCenter = lazy(() => import('../modules/action-center/pages/Index'))
const ProductList = lazy(() => import('../modules/products/pages/List'))
const ProductForm = lazy(() => import('../modules/products/pages/Form'))
const TransactionList = lazy(() => import('../modules/transactions/pages/List'))
const TransactionForm = lazy(() => import('../modules/transactions/pages/Form'))
const TransactionDetail = lazy(
    () => import('../modules/transactions/pages/Detail'),
)
const CustomerList = lazy(() => import('../modules/customers/pages/List'))
const CustomerForm = lazy(() => import('../modules/customers/pages/Form'))
const PaymentList = lazy(() => import('../modules/payments/pages/List'))
const DisputeList = lazy(() => import('../modules/disputes/pages/List'))
const AuditLogList = lazy(() => import('../modules/audit-logs/pages/List'))
const WalletDepositList = lazy(
    () => import('../modules/wallet-deposits/pages/List'),
)
const WalletList = lazy(() => import('../modules/wallets/pages/List'))
const DocumentTemplateList = lazy(
    () => import('../modules/document-templates/pages/List'),
)
const GeneratedDocumentList = lazy(
    () => import('../modules/generated-documents/pages/List'),
)
const PaymentSettings = lazy(
    () => import('../modules/payment-settings/pages/Index'),
)
const PayoutCenter = lazy(() => import('../modules/payouts/pages/Index'))
const MarketplaceOperationsPage = lazy(
    () => import('../modules/marketplace-operations/pages/Index'),
)
const MarketplaceTrustPage = lazy(
    () => import('../modules/marketplace-trust/pages/Index'),
)
const OperationsControlPage = lazy(
    () => import('../modules/operations-control/pages/Index'),
)
const NotificationList = lazy(
    () => import('../modules/notifications/pages/List'),
)
const EscrowBoxList = lazy(() => import('../modules/escrow-boxes/pages/List'))
const EscrowBoxCreate = lazy(
    () => import('../modules/escrow-boxes/pages/Create'),
)
const EscrowBoxDetail = lazy(
    () => import('../modules/escrow-boxes/pages/Detail'),
)
const EscrowFeeRules = lazy(
    () => import('../modules/escrow-boxes/pages/FeeRules'),
)

export const ADMIN_ROUTES = [
    { index: true, element: <Dashboard /> },
    { path: 'action-center', element: <ActionCenter /> },
    { path: 'products', element: <ProductList /> },
    { path: 'products/new', element: <ProductForm /> },
    { path: 'products/:id/edit', element: <ProductForm /> },
    { path: 'customers', element: <CustomerList /> },
    { path: 'customers/new', element: <CustomerForm /> },
    { path: 'customers/:id/edit', element: <CustomerForm /> },
    { path: 'transactions', element: <TransactionList /> },
    { path: 'escrow-boxes', element: <EscrowBoxList /> },
    { path: 'escrow-boxes/new', element: <EscrowBoxCreate /> },
    { path: 'escrow-boxes/:id', element: <EscrowBoxDetail /> },
    { path: 'escrow-fee-rules', element: <EscrowFeeRules /> },
    { path: 'transactions/:id', element: <TransactionDetail /> },
    { path: 'transactions/new', element: <TransactionForm /> },
    { path: 'transactions/:id/edit', element: <TransactionForm /> },
    { path: 'payments', element: <PaymentList /> },
    { path: 'wallets', element: <WalletList /> },
    { path: 'wallet-deposits', element: <WalletDepositList /> },
    { path: 'payment-settings', element: <PaymentSettings /> },
    { path: 'payouts', element: <PayoutCenter /> },
    { path: 'marketplace-operations', element: <MarketplaceOperationsPage /> },
    { path: 'operations-control', element: <OperationsControlPage /> },
    { path: 'notifications', element: <NotificationList /> },
    { path: 'marketplace-trust', element: <MarketplaceTrustPage /> },
    { path: 'disputes', element: <DisputeList /> },
    { path: 'audit-logs', element: <AuditLogList /> },
    { path: 'document-templates', element: <DocumentTemplateList /> },
    { path: 'generated-documents', element: <GeneratedDocumentList /> },
]
