import { BaseButton, BaseDrawer } from '@/components/base'
import { Descriptions, Input, Tag, Timeline } from 'antd'

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
                <>
                    <Descriptions
                        bordered
                        column={1}
                        size="small"
                        items={[
                            {
                                key: 'type',
                                label: 'Loại',
                                children: detail.type || '—',
                            },
                            {
                                key: 'customer',
                                label: 'Khách hàng',
                                children: detail.customer
                                    ? `${detail.customer.code || ''} ${detail.customer.name || ''}`.trim()
                                    : '—',
                            },
                            {
                                key: 'transaction',
                                label: 'Giao dịch',
                                children:
                                    detail.transaction_code ||
                                    detail.transaction?.code ||
                                    '—',
                            },
                            {
                                key: 'message',
                                label: 'Nội dung',
                                children: detail.message || '—',
                            },
                            {
                                key: 'created',
                                label: 'Thời gian',
                                children: detail.created_at || '—',
                            },
                        ]}
                    />
                    {detail.transaction?.events?.length ? (
                        <div style={{ marginTop: 20 }}>
                            <h3>Tiến trình giao dịch</h3>
                            <Timeline
                                items={detail.transaction.events.map(
                                    (event) => ({
                                        children: (
                                            <>
                                                <b>{event.title}</b>
                                                <div>
                                                    {event.description ||
                                                        event.event_type}
                                                </div>
                                                <small>
                                                    {event.created_at}
                                                </small>
                                            </>
                                        ),
                                    }),
                                )}
                            />
                        </div>
                    ) : null}
                    {detail.action_context?.next_action ? (
                        <div style={{ marginTop: 20 }}>
                            <Tag color="blue">
                                Việc tiếp theo:{' '}
                                {detail.action_context.next_action.label}
                            </Tag>
                            {(detail.action_context.blocking_reasons || [])
                                .slice(0, 2)
                                .map((reason) => (
                                    <div key={reason}>
                                        <small>{reason}</small>
                                    </div>
                                ))}
                        </div>
                    ) : null}
                    {!detail.handled_at ? (
                        <div style={{ marginTop: 20 }}>
                            <h3>Hoàn tất xử lý thông báo</h3>
                            <Input.TextArea
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
                        </div>
                    ) : (
                        <Tag color="green" style={{ marginTop: 20 }}>
                            Đã xử lý: {detail.handling_note || 'Đã hoàn tất'}
                        </Tag>
                    )}
                    {detail.action_context?.deep_link ? (
                        <BaseButton
                            style={{ marginTop: 16 }}
                            onClick={() =>
                                onNavigate(detail.action_context.deep_link)
                            }
                        >
                            {detail.action_context?.next_action?.label
                                ? `Mở hồ sơ để ${detail.action_context.next_action.label.toLowerCase()}`
                                : 'Mở hồ sơ liên quan'}
                        </BaseButton>
                    ) : null}
                </>
            ) : null}
        </BaseDrawer>
    )
}
