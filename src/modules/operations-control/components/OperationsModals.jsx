import {
    ClockCircleOutlined,
    FileDoneOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons'
import { Alert, Input, Space, Tag } from 'antd'

import { BaseModal, BaseTable } from '@/components/base'
import {
    statusColor,
    statusLabel,
    valueLabel,
} from '@/contracts/marketplaceLabels'

export default function OperationsModals({
    checklist,
    releaseNote,
    releaseRecord,
    timeline,
    onChecklistClose,
    onRelease,
    onReleaseClose,
    onReleaseNoteChange,
    onTimelineClose,
}) {
    return (
        <>
            <BaseModal
                open={Boolean(releaseRecord)}
                title="Nhả giữ chỗ thủ công"
                submitText="Xác nhận nhả"
                onCancel={onReleaseClose}
                onSubmit={onRelease}
            >
                <Alert
                    showIcon
                    type="warning"
                    title="Thao tác ảnh hưởng trực tiếp đến khả năng giao dịch sản phẩm"
                    description="Chỉ nhả khi đã xác minh giao dịch nguồn không còn quyền giữ sản phẩm. Ghi chú sẽ được lưu vào timeline và audit log."
                />
                <Input.TextArea
                    rows={5}
                    value={releaseNote}
                    onChange={(event) =>
                        onReleaseNoteChange(event.target.value)
                    }
                    placeholder="Nhập lý do và bằng chứng xác minh (bắt buộc, tối thiểu 10 ký tự)"
                />
            </BaseModal>

            <BaseModal
                open={Boolean(timeline)}
                title="Lịch sử trạng thái khả dụng"
                footer={null}
                onCancel={onTimelineClose}
            >
                <Space orientation="vertical" style={{ width: '100%' }}>
                    <Alert
                        showIcon
                        icon={<ClockCircleOutlined />}
                        title={`${timeline?.product?.code || ''} · ${statusLabel(timeline?.product?.availability_status, valueLabel(timeline?.product?.availability_status))} · phiên bản ${timeline?.product?.availability_version || ''}`}
                    />
                    <BaseTable
                        columns={[
                            { title: 'Thời điểm', dataIndex: 'created_at' },
                            {
                                title: 'Từ',
                                dataIndex: 'from_status',
                                render: (value) => (
                                    <Tag color={statusColor(value)}>
                                        {statusLabel(value, valueLabel(value))}
                                    </Tag>
                                ),
                            },
                            {
                                title: 'Sang',
                                dataIndex: 'to_status',
                                render: (value) => (
                                    <Tag color={statusColor(value)}>
                                        {statusLabel(value, valueLabel(value))}
                                    </Tag>
                                ),
                            },
                            { title: 'Giữ đến', dataIndex: 'hold_until' },
                            { title: 'Ghi chú', dataIndex: 'note' },
                        ]}
                        dataSource={timeline?.timeline || []}
                        pagination={false}
                        rowKey="id"
                    />
                </Space>
            </BaseModal>

            <BaseModal
                open={Boolean(checklist)}
                title={`Checklist chứng từ · ${checklist?.transaction?.code || ''}`}
                footer={null}
                onCancel={onChecklistClose}
            >
                <BaseTable
                    columns={[
                        {
                            title: 'Loại chứng từ',
                            dataIndex: 'document_type',
                            render: (value) => valueLabel(value),
                        },
                        {
                            title: 'Đã tạo',
                            dataIndex: 'generated',
                            render: (value) => (
                                <Tag color={value ? 'green' : 'red'}>
                                    {value ? 'Có' : 'Thiếu'}
                                </Tag>
                            ),
                        },
                        {
                            title: 'Đã chấp thuận',
                            dataIndex: 'accepted',
                            render: (value) =>
                                value ? (
                                    <SafetyCertificateOutlined />
                                ) : (
                                    <FileDoneOutlined />
                                ),
                        },
                    ]}
                    dataSource={checklist?.rows || []}
                    pagination={false}
                    rowKey="document_type"
                />
            </BaseModal>
        </>
    )
}
