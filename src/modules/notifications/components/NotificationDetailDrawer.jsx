import './notification-detail.css'
import BaseButton from '@/components/base/BaseButton'
import BaseDrawer from '@/components/base/BaseDrawer'
import { valueLabel } from '@/contracts/marketplaceLabels'

function DetailRow({ label, value }) {
    return (
        <div className="notification-detail-row">
            <dt>{label}</dt>
            <dd>{value || '—'}</dd>
        </div>
    )
}

export default function NotificationDetailDrawer({
    detail,
    loading,
    handlingNote,
    onHandlingNoteChange,
    onHandle,
    onClose,
    onNavigate,
}) {
    return (
        <BaseDrawer
            open={Boolean(detail) || loading}
            loading={loading}
            title={detail?.title || 'Chi tiết thông báo'}
            width={760}
            onClose={onClose}
        >
            {detail ? (
                <div className="notification-detail-stack">
                    <dl className="notification-detail-list">
                        <DetailRow
                            label="Loại"
                            value={valueLabel(detail.type)}
                        />
                        <DetailRow
                            label="Khách hàng"
                            value={
                                detail.customer
                                    ? `${detail.customer.code || ''} ${detail.customer.name || ''}`.trim()
                                    : '—'
                            }
                        />
                        <DetailRow
                            label="Giao dịch"
                            value={
                                detail.transaction_code ||
                                detail.transaction?.code ||
                                '—'
                            }
                        />
                        <DetailRow label="Nội dung" value={detail.message} />
                        <DetailRow
                            label="Thời gian"
                            value={detail.created_at}
                        />
                    </dl>

                    {detail.transaction?.events?.length ? (
                        <section>
                            <h3>Tiến trình giao dịch</h3>
                            <ol className="notification-detail-timeline">
                                {detail.transaction.events.map((event) => (
                                    <li key={event.id || event.created_at}>
                                        <strong>
                                            {event.title ||
                                                valueLabel(event.event_type)}
                                        </strong>
                                        <p>
                                            {event.description ||
                                                valueLabel(event.event_type)}
                                        </p>
                                        <small>{event.created_at}</small>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    ) : null}

                    {detail.action_context?.next_action ? (
                        <section className="notification-detail-notice">
                            <strong>
                                Việc tiếp theo:{' '}
                                {detail.action_context.next_action.label}
                            </strong>
                            {(detail.action_context.blocking_reasons || [])
                                .slice(0, 2)
                                .map((reason) => (
                                    <p key={reason}>{reason}</p>
                                ))}
                        </section>
                    ) : null}

                    {!detail.handled_at ? (
                        <section>
                            <h3>Hoàn tất xử lý thông báo</h3>
                            <textarea
                                className="notification-detail-textarea"
                                rows={3}
                                value={handlingNote}
                                placeholder="Ghi rõ kết quả hoặc lý do xử lý"
                                onChange={(event) =>
                                    onHandlingNoteChange(event.target.value)
                                }
                            />
                            <BaseButton
                                style={{ marginTop: 12 }}
                                disabled={handlingNote.trim().length < 5}
                                onClick={onHandle}
                            >
                                Đánh dấu đã xử lý
                            </BaseButton>
                        </section>
                    ) : (
                        <section className="notification-detail-notice is-success">
                            <strong>Đã xử lý</strong>
                            <p>{detail.handling_note || 'Đã hoàn tất'}</p>
                        </section>
                    )}

                    {detail.action_context?.deep_link ? (
                        <BaseButton
                            onClick={() =>
                                onNavigate(detail.action_context.deep_link)
                            }
                        >
                            {detail.action_context?.next_action?.label
                                ? `Mở hồ sơ để ${detail.action_context.next_action.label.toLowerCase()}`
                                : 'Mở hồ sơ liên quan'}
                        </BaseButton>
                    ) : null}
                </div>
            ) : null}
        </BaseDrawer>
    )
}
