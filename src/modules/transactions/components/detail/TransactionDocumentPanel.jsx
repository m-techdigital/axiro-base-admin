import { BaseButton, BaseConfirmActionButton } from '@/components/base'
import {
    statusColor,
    statusLabel,
    valueLabel,
} from '../../../../contracts/marketplaceLabels'
import { Card, List, Tag } from 'antd'

export default function TransactionDocumentPanel({
    data,
    acting,
    documentLabels,
    ensureDocuments,
    viewDocument,
    downloadDocument,
}) {
    return (
        <Card
            title="Hồ sơ tài liệu"
            style={{ marginTop: 16 }}
            extra={
                <BaseConfirmActionButton
                    type="primary"
                    loading={acting === 'documents'}
                    title="Đồng bộ tài liệu"
                    content="Hệ thống sẽ tạo hoặc cập nhật bộ tài liệu theo trạng thái hiện tại của giao dịch."
                    okText="Đồng bộ"
                    onConfirm={ensureDocuments}
                >
                    Đồng bộ tài liệu
                </BaseConfirmActionButton>
            }
        >
            <List
                dataSource={data?.documents || []}
                locale={{
                    emptyText: 'Chưa phát hành tài liệu cho giao dịch này.',
                }}
                renderItem={(document) => (
                    <List.Item
                        actions={[
                            <BaseButton
                                key="view"
                                onClick={() => viewDocument(document)}
                            >
                                Xem
                            </BaseButton>,
                            <BaseButton
                                key="download"
                                onClick={() => downloadDocument(document)}
                            >
                                Tải PDF
                            </BaseButton>,
                        ]}
                    >
                        <List.Item.Meta
                            title={`${documentLabels[document.document_type] || document.title} · phiên bản ${document.version}`}
                            description={`${document.code} · ${document.acceptances?.length || 0}/2 bên đã xác nhận`}
                        />
                        <Tag
                            color={
                                (document.acceptances?.length || 0) >= 2
                                    ? 'green'
                                    : statusColor(document.status)
                            }
                        >
                            {statusLabel(
                                document.status,
                                valueLabel(
                                    document.status,
                                    document.status || '—',
                                ),
                            )}
                        </Tag>
                    </List.Item>
                )}
            />
        </Card>
    )
}
