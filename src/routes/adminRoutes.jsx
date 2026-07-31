import Dashboard from '../pages/Dashboard'
import ActionCenter from '../modules/action-center/pages/Index'
import ProductList from '../modules/products/pages/List'
import ProductForm from '../modules/products/pages/Form'
import TransactionList from '../modules/transactions/pages/List'
import TransactionForm from '../modules/transactions/pages/Form'
import TransactionDetail from '../modules/transactions/pages/Detail'
import ContractList from '../modules/contracts/pages/List'
import ContractForm from '../modules/contracts/pages/Form'
import CustomerList from '../modules/customers/pages/List'
import CustomerForm from '../modules/customers/pages/Form'
import ListingList from '../modules/listings/pages/List'
import PaymentList from '../modules/payments/pages/List'
import DisputeList from '../modules/disputes/pages/List'
import AuditLogList from '../modules/audit-logs/pages/List'
import WalletDepositList from '../modules/wallet-deposits/pages/List'
import WalletList from '../modules/wallets/pages/List'
import DocumentTemplateList from '../modules/document-templates/pages/List'
import GeneratedDocumentList from '../modules/generated-documents/pages/List'
import PaymentSettings from '../modules/payment-settings/pages/Index'
import PayoutCenter from '../modules/payouts/pages/Index'
import MarketplaceOperationsPage from '../modules/marketplace-operations/pages/Index'
import MarketplaceTrustPage from '../modules/marketplace-trust/pages/Index'

export const ADMIN_ROUTES = [
    { index: true, element: <Dashboard /> },
    { path: 'action-center', element: <ActionCenter /> },
    { path: 'products', element: <ProductList /> },
    { path: 'products/new', element: <ProductForm /> },
    { path: 'products/:id/edit', element: <ProductForm /> },
    { path: 'customers', element: <CustomerList /> },
    { path: 'customers/new', element: <CustomerForm /> },
    { path: 'customers/:id/edit', element: <CustomerForm /> },
    { path: 'listings', element: <ListingList /> },
    { path: 'transactions', element: <TransactionList /> },
    { path: 'transactions/:id', element: <TransactionDetail /> },
    { path: 'transactions/new', element: <TransactionForm /> },
    { path: 'transactions/:id/edit', element: <TransactionForm /> },
    { path: 'payments', element: <PaymentList /> },
    { path: 'wallets', element: <WalletList /> },
    { path: 'wallet-deposits', element: <WalletDepositList /> },
    { path: 'payment-settings', element: <PaymentSettings /> },
    { path: 'payouts', element: <PayoutCenter /> },
    { path: 'marketplace-operations', element: <MarketplaceOperationsPage /> },
    { path: 'marketplace-trust', element: <MarketplaceTrustPage /> },
    { path: 'contracts', element: <ContractList /> },
    { path: 'contracts/new', element: <ContractForm /> },
    { path: 'contracts/:id/edit', element: <ContractForm /> },
    { path: 'disputes', element: <DisputeList /> },
    { path: 'audit-logs', element: <AuditLogList /> },
    { path: 'document-templates', element: <DocumentTemplateList /> },
    { path: 'generated-documents', element: <GeneratedDocumentList /> },
]
