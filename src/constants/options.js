export const option = (value, label) => ({ value, label })

export const CUSTOMER_STATUS_OPTIONS = [
    option('active', 'Đang hoạt động'),
    option('inactive', 'Ngừng hoạt động'),
    option('blocked', 'Đã khóa'),
]

export const GAME_OPTIONS = [
    option('ninja_school', 'Ninja School'),
    option('dragon_ball', 'Ngọc Rồng'),
    option('avatar', 'Avatar'),
]

export const PRODUCT_TYPE_OPTIONS = [
    option('game_account', 'Tài khoản trò chơi'),
    option('item', 'Vật phẩm'),
    option('currency', 'Tiền tệ trong game'),
    option('service', 'Dịch vụ'),
]

export const PRODUCT_STATUS_OPTIONS = [
    option('draft', 'Bản nháp'),
    option('active', 'Đang hoạt động'),
    option('inactive', 'Ngừng hoạt động'),
]

export const CONTRACT_STATUS_OPTIONS = [
    option('draft', 'Bản nháp'),
    option('active', 'Đang hiệu lực'),
    option('completed', 'Đã hoàn tất'),
    option('cancelled', 'Đã hủy'),
]

export const TRANSACTION_STATUS_OPTIONS = [
    option('draft', 'Bản nháp'),
    option('pending_payment', 'Chờ thanh toán'),
    option('partially_paid', 'Thanh toán một phần'),
    option('paid', 'Đã thanh toán'),
    option('handed_over', 'Đã bàn giao'),
    option('active', 'Đang thực hiện'),
    option('returned', 'Đã hoàn trả'),
    option('completed', 'Đã hoàn tất'),
    option('cancelled', 'Đã hủy'),
    option('disputed', 'Đang tranh chấp'),
]

export const DOCUMENT_STATUS_OPTIONS = [
    option('draft', 'Bản nháp'),
    option('published', 'Đã phát hành'),
    option('archived', 'Đã lưu trữ'),
]

export const labelsFromOptions = (options = []) =>
    Object.fromEntries(options.map(({ value, label }) => [value, label]))

export const AUDIT_RISK_OPTIONS = [
    option('normal', 'Bình thường'),
    option('warning', 'Cảnh báo'),
    option('high', 'Rủi ro cao'),
    option('critical', 'Nghiêm trọng'),
]

export const CASE_PRIORITY_OPTIONS = [
    option('low', 'Thấp'),
    option('normal', 'Bình thường'),
    option('high', 'Cao'),
    option('urgent', 'Khẩn cấp'),
]

export const CASE_STATUS_OPTIONS = [
    option('open', 'Mới tiếp nhận'),
    option('reviewing', 'Đang xử lý'),
    option('resolved', 'Đã giải quyết'),
    option('dismissed', 'Đã đóng'),
]

export const CONTENT_TYPE_OPTIONS = [
    option('topic', 'Chủ đề'),
    option('guide', 'Hướng dẫn'),
    option('policy', 'Chính sách'),
    option('announcement', 'Thông báo'),
    option('faq', 'Câu hỏi thường gặp'),
]

export const REVIEW_STATUS_OPTIONS = [
    option('published', 'Đã hiển thị'),
    option('hidden', 'Đã ẩn'),
]
