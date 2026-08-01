import { BaseButton, BaseIconAction, BaseTable } from '@/components/base'
import { ReloadOutlined, RightOutlined, ToolOutlined } from '@ant-design/icons'
import { Alert, Card, Col, Empty, Row, Space, Statistic, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../../components/base/PageHeader'
import service from '../service'

const statusLabel = {
    pending_review: 'Chờ duyệt',
    submitted: 'Chờ đối soát',
    pending: 'Chờ xử lý',
    open: 'Đang mở',
    handover_pending: 'Chờ xác nhận nhận',
    return_pending: 'Chờ xác nhận hoàn trả',
}
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
            <PageHeader
                title="Trung tâm xử lý"
                description="Các việc phát sinh từ MBN cần quản trị viên duyệt, đối soát hoặc can thiệp."
                actions={
                    <BaseButton icon={<ReloadOutlined />} onClick={load}>
                        Tải lại
                    </BaseButton>
                }
            />
            {error && <Alert type="error" message={error} showIcon />}
            <Row gutter={[16, 16]} className="action-center-stats">
                <Col xs={12} lg={4}>
                    <Card>
                        <Statistic
                            title="Tin chờ duyệt"
                            value={counts.pending_listings || 0}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={5}>
                    <Card>
                        <Statistic
                            title="Thanh toán chờ xác nhận"
                            value={counts.submitted_payments || 0}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={5}>
                    <Card>
                        <Statistic
                            title="Nạp tiền chờ xác nhận"
                            value={counts.pending_deposits || 0}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={5}>
                    <Card>
                        <Statistic
                            title="Tranh chấp đang mở"
                            value={counts.open_disputes || 0}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={5}>
                    <Card>
                        <Statistic
                            title="Bàn giao cần theo dõi"
                            value={counts.handover_pending || 0}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} xl={12}>
                    <Card
                        title="Tin đăng chờ duyệt"
                        extra={
                            <BaseButton
                                icon={<RightOutlined />}
                                type="link"
                                onClick={() => navigate('/listings')}
                            >
                                Mở danh sách
                            </BaseButton>
                        }
                    >
                        {compact(data?.listings, [
                            { title: 'Mã', dataIndex: 'code' },
                            {
                                title: 'Khách hàng',
                                render: (_, r) => r.owner?.name,
                            },
                            {
                                title: 'Tài khoản',
                                render: (_, r) => r.product?.name,
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
                                    <Tag color="blue">
                                        {statusLabel[v] || v}
                                    </Tag>
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
            </Row>
        </div>
    )
}
