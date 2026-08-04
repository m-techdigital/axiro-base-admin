# AXIRO Mini Admin — Canonical Index

AXIRO Mini giữ mô hình **một Admin, nhiều khách hàng**, dùng pattern `mini_bounded` từ AXIRO cha nhưng không port runtime company/RBAC/HR/accounting/report/project.

## Tài liệu canonical đang có hiệu lực

1. `ARCHITECTURE-CANONICAL.md` — boundary runtime, owner và nguyên tắc Mini bounded.
2. `OPERATOR-GUIDE.md` — cách vận hành customer/product/transaction/payment/payout/document/support/trust.
3. `PARENT_FIRST_DEVELOPMENT_POLICY.md` — quy tắc chọn lọc pattern từ AXIRO cha.
4. `NEXT-BACKLOG.md` — chỉ chứa việc còn mở sau baseline 2026-08-04.
5. `CHANGELOG-CANONICAL.md` — hợp nhất kết quả các vòng closure trước.
6. `docs/release/BASELINE-RELEASE-CHECKLIST.md` — gate release bắt buộc.

## UI ownership hiện hành

- Layout: `src/layouts/AdminLayout.jsx` và `src/layouts/components/*`.
- Menu: `src/config/adminMenu.jsx`.
- Form/list/filter/table/modal/drawer/header: `src/components/base/*`.
- Relation: config canonical + `useRelationOptions`, resolver/cache/normalizer riêng.
- Review actions: duyệt dùng confirm; từ chối dùng `BaseReviewActionModal` và lý do bắt buộc.
- Enum labels: `src/contracts/marketplaceLabels.js` và marketplace options contract.

## Tài liệu lịch sử

Các file closure có ngày trong tên được giữ làm audit trail. Khi có mâu thuẫn, bộ canonical phía trên và release evidence mới nhất là nguồn sự thật.
