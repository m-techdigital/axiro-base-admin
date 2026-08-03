import { ToolOutlined } from '@ant-design/icons'
import {
    BaseIconAction,
    BaseModal,
    BaseTable,
    BaseButton,
    BaseConfirmActionButton,
} from '@/components/base'
import {
    Alert,
    Card,
    Descriptions,
    Input,
    Space,
    Tabs,
    Tag,
    Typography,
    message,
} from 'antd'
import { useCallback, useEffect, useState } from 'react'
import {
    statusColor,
    statusLabel,
    valueLabel,
} from '@/contracts/marketplaceLabels'
import PageHeader from '../../../components/base/PageHeader'
import Money from '../../../components/base/Money'
import service from '../service'
const extract = (r) => r?.data?.data || r?.data || []
const status = (v) => (
    <Tag color={statusColor(v)}>{statusLabel(v, valueLabel(v, v || '—'))}</Tag>
)
export default function PayoutCenter() {
    const [active, setActive] = useState('withdrawals'),
        [rows, setRows] = useState([]),
        [loading, setLoading] = useState(false),
        [selected, setSelected] = useState(null),
        [note, setNote] = useState(''),
        [reference, setReference] = useState('')
    const load = useCallback(async () => {
        setLoading(true)
        try {
            const r =
                active === 'verifications'
                    ? await service.verifications()
                    : active === 'accounts'
                      ? await service.accounts()
                      : await service.withdrawals()
            setRows(extract(r))
        } catch (e) {
            message.error(e.message)
        } finally {
            setLoading(false)
        }
    }, [active])
    useEffect(() => {
        load()
    }, [load])
    const act = async (fn) => {
        try {
            await fn()
            message.success('Đã cập nhật')
            setSelected(null)
            setNote('')
            setReference('')
            load()
        } catch (e) {
            message.error(e.message)
        }
    }
    const verificationCols = [
        { title: 'Khách hàng', render: (_, r) => r.customer?.name },
        {
            title: 'Giấy tờ',
            render: (_, r) =>
                `${valueLabel(r.document_type)} · ${r.document_number || '—'}`,
        },
        { title: 'Trạng thái', dataIndex: 'status', render: status },
        { title: 'Ngày gửi', dataIndex: 'submitted_at' },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, r) => (
                <BaseIconAction
                    icon={<ToolOutlined />}
                    label="Xử lý"
                    onClick={() => setSelected(r)}
                />
            ),
        },
    ]
    const accountCols = [
        { title: 'Khách hàng', render: (_, r) => r.customer?.name },
        { title: 'Ngân hàng', dataIndex: 'bank_name' },
        { title: 'Chủ tài khoản', dataIndex: 'account_name' },
        { title: 'Số tài khoản', dataIndex: 'account_number' },
        { title: 'Trạng thái', dataIndex: 'status', render: status },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, r) => (
                <BaseIconAction
                    icon={<ToolOutlined />}
                    label="Xử lý"
                    onClick={() => setSelected(r)}
                />
            ),
        },
    ]
    const withdrawalCols = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Khách hàng', render: (_, r) => r.customer?.name },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (v) => <Money value={v} />,
        },
        {
            title: 'Tài khoản',
            render: (_, r) =>
                `${r.payout_account?.bank_name || ''} · ${r.payout_account?.account_number || ''}`,
        },
        { title: 'Trạng thái', dataIndex: 'status', render: status },
        {
            title: 'Việc tiếp theo',
            render: (_, r) =>
                r.journey?.next_action?.label ||
                r.journey?.blocked_reason ||
                'Không còn thao tác',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, r) => (
                <BaseIconAction
                    icon={<ToolOutlined />}
                    label="Xử lý"
                    onClick={() => setSelected(r)}
                />
            ),
        },
    ]
    const columns =
        active === 'verifications'
            ? verificationCols
            : active === 'accounts'
              ? accountCols
              : withdrawalCols
    return (
        <div className="page">
            <PageHeader title="Xác minh và chi trả người bán" />
            <Card>
                <Tabs
                    activeKey={active}
                    onChange={setActive}
                    items={[
                        { key: 'withdrawals', label: 'Yêu cầu rút tiền' },
                        { key: 'verifications', label: 'Xác minh người bán' },
                        { key: 'accounts', label: 'Tài khoản nhận tiền' },
                    ]}
                />
                <BaseTable
                    rowKey="id"
                    loading={loading}
                    dataSource={rows}
                    columns={columns}
                    scroll={{ x: 900 }}
                />
            </Card>
            <BaseModal
                open={!!selected}
                onCancel={() => setSelected(null)}
                footer={null}
                title="Xử lý yêu cầu"
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    {active === 'withdrawals' && selected?.journey ? (
                        <>
                            <Alert
                                showIcon
                                type={
                                    selected.journey.next_action
                                        ? 'info'
                                        : 'success'
                                }
                                message={
                                    selected.journey.next_action?.label ||
                                    selected.journey.blocked_reason
                                }
                            />
                            <Descriptions
                                bordered
                                size="small"
                                column={1}
                                items={[
                                    {
                                        key: 'verification',
                                        label: 'Xác minh người bán',
                                        children:
                                            selected.journey.customer_context
                                                ?.verification_status || '—',
                                    },
                                    {
                                        key: 'account',
                                        label: 'Tài khoản nhận tiền',
                                        children:
                                            selected.journey.customer_context
                                                ?.payout_account_status || '—',
                                    },
                                    {
                                        key: 'available',
                                        label: 'Số dư khả dụng',
                                        children: (
                                            <Money
                                                value={
                                                    selected.journey
                                                        .customer_context
                                                        ?.available_balance
                                                }
                                            />
                                        ),
                                    },
                                    {
                                        key: 'held',
                                        label: 'Đang tạm giữ',
                                        children: (
                                            <Money
                                                value={
                                                    selected.journey
                                                        .customer_context
                                                        ?.held_balance
                                                }
                                            />
                                        ),
                                    },
                                ]}
                            />
                        </>
                    ) : null}
                    <Typography.Text type="secondary">
                        Mọi quyết định sẽ được ghi nhận để đối soát.
                    </Typography.Text>
                    <Input.TextArea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ghi chú xử lý"
                    />
                    {active === 'withdrawals' && (
                        <Input
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Mã tham chiếu chuyển khoản"
                        />
                    )}
                    <Space wrap>
                        {active === 'verifications' && (
                            <>
                                <BaseConfirmActionButton
                                    type="primary"
                                    title="Xác minh người bán"
                                    content="Xác nhận hồ sơ người bán đã hợp lệ để tiếp tục luồng nhận tiền."
                                    okText="Xác minh"
                                    onConfirm={() =>
                                        act(() =>
                                            service.reviewVerification(
                                                selected.id,
                                                'verify',
                                                note,
                                            ),
                                        )
                                    }
                                >
                                    Xác minh
                                </BaseConfirmActionButton>
                                <BaseConfirmActionButton
                                    danger
                                    title="Từ chối hồ sơ người bán"
                                    content="Hồ sơ bị từ chối sẽ yêu cầu khách hàng cập nhật và gửi lại."
                                    okText="Từ chối"
                                    onConfirm={() =>
                                        act(() =>
                                            service.reviewVerification(
                                                selected.id,
                                                'reject',
                                                note || 'Hồ sơ chưa hợp lệ',
                                            ),
                                        )
                                    }
                                >
                                    Từ chối
                                </BaseConfirmActionButton>
                            </>
                        )}
                        {active === 'accounts' && (
                            <>
                                <BaseConfirmActionButton
                                    type="primary"
                                    title="Xác minh tài khoản nhận tiền"
                                    content="Tài khoản đã xác minh có thể được dùng để tạo yêu cầu rút tiền."
                                    okText="Xác minh"
                                    onConfirm={() =>
                                        act(() =>
                                            service.reviewAccount(
                                                selected.id,
                                                'verify',
                                                note,
                                            ),
                                        )
                                    }
                                >
                                    Xác minh
                                </BaseConfirmActionButton>
                                <BaseConfirmActionButton
                                    danger
                                    title="Từ chối tài khoản nhận tiền"
                                    content="Tài khoản bị từ chối sẽ không được dùng để rút tiền."
                                    okText="Từ chối"
                                    onConfirm={() =>
                                        act(() =>
                                            service.reviewAccount(
                                                selected.id,
                                                'reject',
                                                note || 'Tài khoản chưa hợp lệ',
                                            ),
                                        )
                                    }
                                >
                                    Từ chối
                                </BaseConfirmActionButton>
                            </>
                        )}
                        {active === 'withdrawals' && (
                            <>
                                <BaseConfirmActionButton
                                    title="Duyệt yêu cầu rút tiền"
                                    content="Chỉ duyệt khi điều kiện xác minh, tài khoản nhận và số dư khả dụng đã phù hợp."
                                    okText="Duyệt"
                                    onConfirm={() =>
                                        act(() => service.approve(selected.id))
                                    }
                                >
                                    Duyệt
                                </BaseConfirmActionButton>
                                <BaseConfirmActionButton
                                    type="primary"
                                    disabled={!reference}
                                    title="Xác nhận đã chi trả"
                                    content="Hành động này xác nhận tiền đã được chuyển theo mã tham chiếu đã nhập."
                                    okText="Xác nhận đã chi"
                                    onConfirm={() =>
                                        act(() =>
                                            service.paid(
                                                selected.id,
                                                reference,
                                            ),
                                        )
                                    }
                                >
                                    Xác nhận đã chi
                                </BaseConfirmActionButton>
                                <BaseConfirmActionButton
                                    danger
                                    title="Từ chối yêu cầu rút tiền"
                                    content="Yêu cầu bị từ chối sẽ không được chi trả trong lượt xử lý này."
                                    okText="Từ chối"
                                    onConfirm={() =>
                                        act(() =>
                                            service.reject(
                                                selected.id,
                                                note || 'Yêu cầu không hợp lệ',
                                            ),
                                        )
                                    }
                                >
                                    Từ chối
                                </BaseConfirmActionButton>
                            </>
                        )}
                    </Space>
                </Space>
            </BaseModal>
        </div>
    )
}
