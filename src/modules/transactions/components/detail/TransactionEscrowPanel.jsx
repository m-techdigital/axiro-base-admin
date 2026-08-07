import { Descriptions, Tag, Typography } from 'antd'

const methodLabels = {
    account_credentials: 'Thông tin đăng nhập qua kênh bảo mật',
    email_transfer: 'Chuyển quyền email/liên kết',
    in_game_trade: 'Giao dịch trực tiếp trong game',
    gift_code: 'Mã quà tặng / mã vật phẩm',
}

export default function TransactionEscrowPanel({ transaction }) {
    const escrow = transaction?.command_center?.escrow_handover
    const agreement = transaction?.agreement_terms || {}
    if (!escrow?.delivery_method) return null

    return (
        <Descriptions
            bordered
            size="small"
            column={{ xs: 1, md: 2 }}
            title="Bàn giao trung gian"
        >
            <Descriptions.Item label="Nguồn giao dịch">
                {transaction?.initiation_source === 'escrow_box'
                    ? 'Box giao dịch trung gian'
                    : 'Từ tin đăng'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thỏa thuận">
                {transaction?.agreement_status || 'accepted'}
            </Descriptions.Item>
            <Descriptions.Item label="Tài sản thỏa thuận" span={2}>
                {agreement.asset_title || transaction?.product?.name || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức">
                {methodLabels[escrow.delivery_method] || escrow.delivery_method}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian kiểm tra">
                {escrow.inspection_period_minutes || 30} phút
            </Descriptions.Item>
            <Descriptions.Item label="Hạn kiểm tra">
                {escrow.inspection_deadline_at || 'Chưa bắt đầu'}
            </Descriptions.Item>
            <Descriptions.Item label="Biên bản trước bàn giao">
                <Tag
                    color={
                        escrow.requires_pre_handover_snapshot
                            ? 'blue'
                            : 'default'
                    }
                >
                    {escrow.requires_pre_handover_snapshot
                        ? 'Bắt buộc'
                        : 'Không bắt buộc'}
                </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả thỏa thuận" span={2}>
                <Typography.Text>
                    {agreement.asset_description || '—'}
                </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Hướng dẫn bàn giao" span={2}>
                <Typography.Text>
                    {escrow.seller_delivery_note || 'Chưa có'}
                </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú kiểm tra" span={2}>
                <Typography.Text>
                    {escrow.buyer_inspection_note || 'Chưa có'}
                </Typography.Text>
            </Descriptions.Item>
        </Descriptions>
    )
}
