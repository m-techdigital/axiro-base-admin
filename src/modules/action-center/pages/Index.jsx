import {
    BaseButton,
    BaseIconAction,
    BasePageHeader,
    BaseTable,
    Money,
} from '@/components/base'
import { ReloadOutlined, RightOutlined, ToolOutlined } from '@ant-design/icons'
import { Alert, Card, Col, Empty, Row, Statistic, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { statusColor, statusLabel } from '@/contracts/marketplaceLabels'
import service from '../service'

export default function ActionCenter() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await service.get()
            setData(response.data)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        load()
    }, [])
    const counts = data?.counts || {}
    const compact = (rows, columns) => (
        <BaseTable
            rowKey="id"
            size="small"
            loading={loading}
            dataSource={rows || []}
            columns={columns}
            pagination={false}
            locale={{
                emptyText: (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không có việc chờ xử lý"
                    />
                ),
            }}
        />
    )
    return (
        <div className="page">
            <BasePageHeader
                title="Trung tâm xử lý"
                description="Các việc phát sinh từ MBN cần quản trị viên duyệt, đối soát hoặc can thiệp."
                actions={
                    <BaseButton icon={<ReloadOutlined />} onClick={load}>
                        Tải lại
                    </BaseButton>
                }
            />
            {error && <Alert type="error" title={error} showIcon />}
            <div className="action-center-stats">
                {[
                    ['Sản phẩm chờ duyệt', counts.pending_products],
                    ['Thanh toán chờ xác nhận', counts.submitted_payments],
                    ['Nạp tiền chờ xác nhận', counts.pending_deposits],
                    ['Tranh chấp đang mở', counts.open_disputes],
                    ['Bàn giao cần theo dõi', counts.handover_pending],
                    ['Đối soát cọc thuê', counts.rental_deposit_review],
                    ['Payout chờ xử lý', counts.pending_payouts],
                    ['Giữ chỗ quá hạn', counts.expired_holds],
                ].map(([title, value]) => (
                    <Card key={title}>
                        <Statistic title={title} value={value || 0} />
                    </Card>
                ))}
            </div>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} xl={12}>
                    <Card
                        title="Sản phẩm chờ duyệt"
                        extra={
                            <BaseButton
                                icon={<RightOutlined />}
                                type="link"
                                onClick={() => navigate('/products')}
                            >
                                Mở danh sách
                            </BaseButton>
                        }
                    >
                        {compact(data?.products, [
                            { title: 'Mã', dataIndex: 'code' },
                            {
                                title: 'Khách hàng',
                                render: (_, r) => r.owner?.name,
                            },
                            {
                                title: 'Tài khoản',
                                render: (_, r) => r.name || r.product?.name,
                            },
                            {
                                title: '',
                                render: () => <Tag color="gold">Chờ duyệt</Tag>,
                            },
                        ])}
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card
                        title="Thanh toán chờ đối soát"
                        extra={
                            <BaseButton
                                icon={<RightOutlined />}
                                type="link"
                                onClick={() => navigate('/payments')}
                            >
                                Mở danh sách
                            </BaseButton>
                        }
                    >
                        {compact(data?.payments, [
                            { title: 'Mã', dataIndex: 'code' },
                            {
                                title: 'Khách hàng',
                                render: (_, r) => r.customer?.name,
                            },
                            {
                                title: 'Giao dịch',
                                render: (_, r) => (
                                    <BaseButton
                                        type="link"
                                        onClick={() =>
                                            navigate(
                                                `/transactions/${r.transaction_id}`,
                                            )
                                        }
                                    >
                                        {r.transaction?.code}
                                    </BaseButton>
                                ),
                            },
                            {
                                title: '',
                                render: () => <Tag color="blue">Đã gửi</Tag>,
                            },
                        ])}
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card
                        title="Tranh chấp đang mở"
                        extra={
                            <BaseButton
                                icon={<RightOutlined />}
                                type="link"
                                onClick={() => navigate('/disputes')}
                            >
                                Mở danh sách
                            </BaseButton>
                        }
                    >
                        {compact(data?.disputes, [
                            { title: 'Mã', dataIndex: 'code' },
                            {
                                title: 'Người mở',
                                render: (_, r) => r.opened_by?.name,
                            },
                            {
                                title: 'Giao dịch',
                                render: (_, r) => (
                                    <BaseButton
                                        type="link"
                                        onClick={() =>
                                            navigate(
                                                `/transactions/${r.transaction_id}`,
                                            )
                                        }
                                    >
                                        {r.transaction?.code}
                                    </BaseButton>
                                ),
                            },
                            {
                                title: '',
                                render: () => <Tag color="red">Đang mở</Tag>,
                            },
                        ])}
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card title="Bàn giao và hoàn trả cần theo dõi">
                        {compact(data?.transactions, [
                            { title: 'Mã', dataIndex: 'code' },
                            {
                                title: 'Tài khoản',
                                render: (_, r) => r.product?.name,
                            },
                            {
                                title: 'Trạng thái',
                                dataIndex: 'status',
                                render: (v) => (
                                    <Tag color="blue">{statusLabel(v)}</Tag>
                                ),
                            },
                            {
                                title: '',
                                render: (_, r) => (
                                    <BaseIconAction
                                        icon={<ToolOutlined />}
                                        label="Xử lý giao dịch"
                                        onClick={() =>
                                            navigate(`/transactions/${r.id}`)
                                        }
                                    />
                                ),
                            },
                        ])}
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card title="Hoàn cọc / khấu trừ cần quyết định">
                        {compact(data?.rental_deposits, [
                            { title: 'Mã', dataIndex: 'code' },
                            {
                                title: 'Sản phẩm',
                                render: (_, r) => r.product?.name,
                            },
                            {
                                title: 'Tiền cọc',
                                dataIndex: 'deposit_amount',
                                render: (value) => <Money value={value} />,
                            },
                            {
                                title: '',
                                render: (_, r) => (
                                    <BaseButton
                                        type="link"
                                        onClick={() =>
                                            navigate(`/transactions/${r.id}`)
                                        }
                                    >
                                        Đối soát
                                    </BaseButton>
                                ),
                            },
                        ])}
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card title="Payout chờ duyệt / chi">
                        {compact(data?.payouts, [
                            { title: 'Mã', dataIndex: 'code' },
                            {
                                title: 'Khách hàng',
                                render: (_, r) => r.customer?.name,
                            },
                            {
                                title: 'Số tiền',
                                dataIndex: 'amount',
                                render: (value) => <Money value={value} />,
                            },
                            {
                                title: 'Trạng thái',
                                dataIndex: 'status',
                                render: (v) => (
                                    <Tag color={statusColor(v)}>
                                        {statusLabel(v)}
                                    </Tag>
                                ),
                            },
                        ])}
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card title="Sản phẩm đang giữ chỗ / quá hạn">
                        {compact(data?.holds, [
                            {
                                title: 'Sản phẩm',
                                render: (_, r) => r.product?.name,
                            },
                            {
                                title: 'Khách hàng',
                                render: (_, r) => r.customer?.name,
                            },
                            { title: 'Giữ đến', dataIndex: 'hold_until' },
                            {
                                title: 'Trạng thái',
                                render: (_, r) => (
                                    <Tag
                                        color={
                                            new Date(r.hold_until) < new Date()
                                                ? 'red'
                                                : 'blue'
                                        }
                                    >
                                        {new Date(r.hold_until) < new Date()
                                            ? 'Quá hạn'
                                            : 'Đang giữ'}
                                    </Tag>
                                ),
                            },
                        ])}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
