import { BaseTable } from '@/components/base'
import { Card, Statistic, Typography, Tag } from 'antd'
import { useEffect, useState } from 'react'
import api from '../services/axios'
import Money from '../components/base/Money'

const demoRows = [
    {
        key: 'installment',
        code: 'TRX-DEMO-INSTALLMENT',
        account: 'customer',
        scenario: 'Mua trả góp',
        status: 'partially_paid',
        expected: 'Kỳ 1 đã xác nhận, kỳ 2 chờ duyệt, kỳ 3 chưa đến hạn',
    },
    {
        key: 'sale',
        code: 'TRX-DEMO-COMPLETED-SALE',
        account: 'customer',
        scenario: 'Mua bán hoàn tất',
        status: 'completed',
        expected: 'Có tài liệu giao dịch, bàn giao và tranh chấp đã giải quyết',
    },
    {
        key: 'rental',
        code: 'TRX-DEMO-ACTIVE-RENTAL',
        account: 'renter',
        scenario: 'Thuê đang hoạt động',
        status: 'active',
        expected: 'Đã thanh toán, đã bàn giao, chưa đến hạn trả',
    },
    {
        key: 'return',
        code: 'TRX-DEMO-RETURNED-RENTAL',
        account: 'customer',
        scenario: 'Đã hoàn trả tài khoản thuê',
        status: 'returned',
        expected: 'Đang chờ hoàn tất đối soát tiền cọc',
    },
    {
        key: 'dispute',
        code: 'TRX-DEMO-DISPUTE-OPEN',
        account: 'dispute',
        scenario: 'Khiếu nại đang mở',
        status: 'disputed',
        expected: 'Có bằng chứng và yêu cầu xử lý trong mục Tranh chấp',
    },
]

export default function Dashboard() {
    const [d, setD] = useState({})
    useEffect(() => {
        api.get('/dashboard').then((r) => setD(r.data))
    }, [])
    const stats = [
        ['Khách hàng', d.customers || 0],
        ['Sản phẩm', d.products || 0],
        ['Sản phẩm chờ duyệt', d.pending_products || 0],
        ['Giao dịch', d.transactions || 0],
        ['Thanh toán chờ xác nhận', d.pending_payments || 0],
        ['Nạp tiền chờ xác nhận', d.pending_deposits || 0],
        ['Tranh chấp đang mở', d.open_disputes || 0],
        ['Payout chờ xử lý', d.pending_withdrawals || 0],
        ['Hoàn cọc / khấu trừ', d.rental_deposit_review || 0],
        ['Giữ chỗ quá hạn', d.expired_holds || 0],
        ['Tài liệu phát hành', d.generated_documents || 0],
    ]
    return (
        <div className="page">
            <Typography.Title level={2}>Tổng quan MBN</Typography.Title>
            <div className="stat-grid">
                {stats.map(([title, value]) => (
                    <Card key={title}>
                        <Statistic title={title} value={value} />
                    </Card>
                ))}
                <Card>
                    <Statistic
                        title="Giá trị giao dịch"
                        formatter={() => <Money value={d.transaction_value} />}
                    />
                </Card>
            </div>
            <Card
                title="Kịch bản dữ liệu mẫu đồng bộ MBN ↔ AXIRO Admin"
                style={{ marginTop: 20 }}
            >
                <Typography.Paragraph>
                    Mật khẩu chung cho các tài khoản khách hàng mẫu:{' '}
                    <b>change-me</b>. Đăng nhập MBN bằng tài khoản ở cột “Tài
                    khoản” để xem cùng dữ liệu đang hiển thị tại AXIRO Admin.
                </Typography.Paragraph>
                <BaseTable
                    size="small"
                    pagination={false}
                    dataSource={demoRows}
                    columns={[
                        { title: 'Mã giao dịch', dataIndex: 'code' },
                        { title: 'Tài khoản MBN', dataIndex: 'account' },
                        { title: 'Kịch bản', dataIndex: 'scenario' },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'status',
                            render: (v) => <Tag>{v}</Tag>,
                        },
                        {
                            title: 'Kết quả cần kiểm tra',
                            dataIndex: 'expected',
                        },
                    ]}
                />
            </Card>
        </div>
    )
}
