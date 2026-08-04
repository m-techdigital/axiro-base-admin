import './reconciliation.css'
import Money from '@/components/base/Money'

function Metric({ danger = false, title, value }) {
    return (
        <article
            className={`operations-reconciliation-stat${
                danger ? ' is-danger' : ''
            }`}
        >
            <span>{title}</span>
            <strong>{value ?? 0}</strong>
        </article>
    )
}

function MoneyMetric({ title, value }) {
    return (
        <article className="operations-reconciliation-stat">
            <span>{title}</span>
            <strong>
                <Money value={value} />
            </strong>
        </article>
    )
}

export default function ReconciliationSummary({ reconciliation }) {
    const imbalanceEntries = [
        ['Ví âm', reconciliation.imbalances?.wallet_negative || 0],
        [
            'Giao dịch trả thừa',
            reconciliation.imbalances?.transaction_overpaid || 0,
        ],
        [
            'Giải ngân vượt escrow',
            reconciliation.imbalances?.release_exceeds_escrow || 0,
        ],
    ]
    const hasImbalance = imbalanceEntries.some(([, value]) => Boolean(value))

    return (
        <div className="operations-reconciliation-stack">
            <div className="base-statistics-grid">
                <Metric
                    title="Thanh toán chờ duyệt"
                    value={reconciliation.payments?.submitted_count}
                />
                <Metric
                    danger
                    title="Thanh toán quá hạn"
                    value={reconciliation.payments?.overdue_count}
                />
                <MoneyMetric
                    title="Tiền ví khả dụng"
                    value={reconciliation.wallet?.available}
                />
                <MoneyMetric
                    title="Tiền đang giữ"
                    value={reconciliation.wallet?.held}
                />
                <MoneyMetric
                    title="Payout đang chờ"
                    value={reconciliation.payouts?.submitted}
                />
                <MoneyMetric
                    title="Đã hoàn"
                    value={reconciliation.refunds?.amount}
                />
            </div>
            <section
                className={`operations-reconciliation-notice ${
                    hasImbalance ? 'is-danger' : 'is-success'
                }`}
                aria-live="polite"
            >
                <strong>Kiểm tra mất cân đối</strong>
                <p>
                    {imbalanceEntries
                        .map(([label, value]) => `${label}: ${value}`)
                        .join('; ')}
                    .
                </p>
            </section>
        </div>
    )
}
