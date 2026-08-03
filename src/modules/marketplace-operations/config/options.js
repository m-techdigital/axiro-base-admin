export const CASE_TYPES = [
    'support',
    'cancellation',
    'refund',
    'handover_issue',
    'return_issue',
    'payment_issue',
    'dispute',
    'appeal',
]

export const CASE_STATUSES = [
    'open',
    'triaged',
    'waiting_customer',
    'waiting_counterparty',
    'reviewing',
    'resolved',
    'rejected',
    'cancelled',
]

export const MARKETPLACE_OPERATION_TABS = [
    { key: 'cases', label: 'Trung tâm yêu cầu' },
    { key: 'fees', label: 'Chính sách phí' },
    { key: 'snapshots', label: 'Biên bản hiện trạng' },
]

export const DEFAULT_FEE_POLICY = {
    buyer_fee_rate: 0,
    buyer_fixed_fee: 0,
    seller_fee_rate: 0,
    seller_fixed_fee: 0,
    tax_rate: 0,
    priority: 100,
    is_active: true,
}
