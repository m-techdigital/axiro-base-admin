import actionCenterService from './action-center/service'
import auditLogsService from './audit-logs/service'
import customersService from './customers/service'
import disputesService from './disputes/service'
import documentTemplatesService from './document-templates/service'
import generatedDocumentsService from './generated-documents/service'
import marketplaceOperationsService from './marketplace-operations/service'
import marketplaceTrustService from './marketplace-trust/service'
import notificationsService from './notifications/service'
import operationsControlService from './operations-control/service'
import paymentSettingsService from './payment-settings/service'
import paymentsService from './payments/service'
import payoutsService from './payouts/service'
import productsService from './products/service'
import transactionsService from './transactions/service'
import walletDepositsService from './wallet-deposits/service'
import walletsService from './wallets/service'

export const MODULE_REGISTRY = {
    'action-center': { service: actionCenterService },
    'audit-logs': { service: auditLogsService },
    customers: { service: customersService },
    disputes: { service: disputesService },
    'document-templates': { service: documentTemplatesService },
    'generated-documents': { service: generatedDocumentsService },
    'marketplace-operations': { service: marketplaceOperationsService },
    'marketplace-trust': { service: marketplaceTrustService },
    notifications: { service: notificationsService },
    'operations-control': { service: operationsControlService },
    'payment-settings': { service: paymentSettingsService },
    payments: { service: paymentsService },
    payouts: { service: payoutsService },
    products: { service: productsService },
    transactions: { service: transactionsService },
    'wallet-deposits': { service: walletDepositsService },
    wallets: { service: walletsService },
}
