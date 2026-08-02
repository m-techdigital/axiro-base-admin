# AXIRO Mini Canonical Architecture

AXIRO cha là chuẩn kiến trúc cho Mini. Mini chỉ rút gọn phạm vi nghiệp vụ, không tạo một kiến trúc UI/API thứ hai.

## Frontend Admin
- Layout owner: `src/layouts/AdminLayout.jsx` và `src/layouts/components/*`.
- Menu owner: `src/config/adminMenu.jsx`.
- UI dùng chung: `src/components/base/index.js`.
- Danh sách dùng `BaseListView` và `BaseTable`; modal/drawer/form/header dùng base tương ứng.
- Token và primitive nằm dưới `src/styles/tokens` và `src/styles/primitives`.
- Không nhập trực tiếp `Table`, `Modal`, `Drawer` hoặc `Form` của Ant Design trong module khi base tương ứng đáp ứng được nhu cầu.

## Backend API
Xem tài liệu canonical tương ứng trong repo API. Mini giữ response envelope, FormRequest, Resource/presenter, service lifecycle và audit conventions của AXIRO cha, nhưng không kéo RBAC/company/project vào.

- `TRANSACTION_DOCUMENT_DISPUTE_CLOSURE_20260802.md`: chuẩn hóa key hồ sơ giao dịch và outcome tranh chấp cuối.
- `TRANSACTION_OPTIONS_DISPUTE_OUTCOME_E2E_20260802.md`

- `MARKETPLACE_OPTIONS_RENTAL_E2E_20260802.md`: options cache/version, dispute timeline và rental E2E.
- `MARKETPLACE_OPTIONS_RENTAL_DEDUCTION_CLOSURE_20260802.md`
- `ADMIN_NOTIFICATION_RENTAL_SETTLEMENT_CLOSURE_20260803.md`: admin notification center, rental operation queues và settlement audit/export.
- `ADMIN_NOTIFICATION_SETTLEMENT_FILTER_BUNDLE_CLOSURE_20260803.md`: notification detail drawer, settlement filters/export và route bundle splitting.
