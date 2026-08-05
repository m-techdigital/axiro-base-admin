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
- `OPERATIONS_PRESETS_EXPORT_QUEUE_20260803.md`: saved filter presets, unread notification counter và queued rental settlement export.
- `ADMIN_BASE_CRUD_ACTION_ALIGNMENT_20260803.md`: chuẩn hóa Admin CRUD form/detail action theo base owner và parent pattern.
- `ARCHITECTURE-CANONICAL.md`: transaction là lifecycle owner, document chỉ là hồ sơ giao dịch.
- `OPERATOR-GUIDE.md`: hướng dẫn admin/customer dùng command center, next action và checklist.
- `NEXT-BACKLOG.md`: backlog tiếp theo để khép vòng vận hành mà không phình module.
- `NOTIFICATION-PAYOUT-JOURNEY-CLOSURE-20260803.md`
- `OPERATIONAL-AUDIT-TODAY-QUEUE-CLOSURE-20260803.md`
- [Large file domain ownership closure](./LARGE_FILE_DOMAIN_OWNERSHIP_20260803.md)

- [Lifecycle, relation, UI and lightweight E2E closure](./LIFECYCLE_RELATION_UI_E2E_CLOSURE_20260803.md)

## Recovery baseline

- [Recovery audit 2026-08-04](../release/RECOVERY-AUDIT-20260804.md)
- `docs/release/recovery-baseline.json` là manifest carry-forward bắt buộc; ZIP mới không tự động được xem là mới hơn baseline đã finalize.

- `MARKETPLACE_ESCROW_DIGITAL_ASSET_20260805.md`: luồng giao dịch trung gian Mini-bounded cho tài khoản và vật phẩm trong game, snapshot bàn giao, inspection window và ranh giới dữ liệu nhạy cảm.

- [Escrow Box canonical](./ESCROW_BOX_CANONICAL_20260805.md) — private one-time invite, versioned terms, fee snapshot, Admin handover and optimized private media.
