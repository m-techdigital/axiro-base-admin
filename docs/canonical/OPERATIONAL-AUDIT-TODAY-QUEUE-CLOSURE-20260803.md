# AXIRO Mini - Operational Audit & Today Queue Closure

**Ngày:** 2026-08-03  
**Phạm vi:** một admin - nhiều khách hàng.

## Quyết định

- Notification có trạng thái `handled` riêng với read/unread.
- Action hoàn tất giao dịch hoặc giải quyết tranh chấp tự đóng notification liên quan.
- Payout, seller verification và payout account review phải ghi audit actor/time/reason.
- Dashboard Today gom payout chờ xử lý, giao dịch kẹt, tài liệu chờ xác nhận và notification chưa xử lý.
- Timeline vận hành dùng chung shape cho transaction, withdrawal và support case.
- Customer payout journey hiển thị rõ trạng thái đang chờ xác minh hoặc đang chờ chi trả.
- Operations UI phải tách owner:
    - Page điều phối tab/data/modal.
    - Column/metric render nằm trong `src/modules/operations-control/components`.
    - Service module chỉ giữ endpoint wrapper, không chứa render logic.

## Không mở rộng

Không port RBAC, company/project/team, Accounting, Reports, generic workflow/SLA hoặc fraud engine.

## UI language follow-up

- The operations-control contract keys remain unchanged.
- Remaining visible English labels for hold/availability ownership were normalized to Vietnamese (`Giữ chỗ`, `Lịch sử trạng thái khả dụng`, `Giữ đến`).

## Large-file ownership follow-up — 2026-08-03

- Large files are split only when a stable business owner exists; line count alone is not a reason to introduce another abstraction.
- `operations-control/pages/Index.jsx` now coordinates tab selection, shared loading and modal state only.
- `OverviewTab`, `HoldsTab`, `QueuesTab`, and `ReconciliationTab` own their tab rendering.
- `useSettlementExport` owns queued-export polling and prevents overlapping status requests.
- `OperationsModals` owns release, availability timeline, and document-checklist overlays.

## Transaction detail ownership follow-up

- `transactions/pages/Detail.jsx` remains the route orchestration owner.
- Transaction field presentation metadata is owned by `transactions/config/detailPresentation.js`.
- Rental deposit settlement and document preview modals are owned by `transactions/components/TransactionDetailModals.jsx`.
- Public routes and API contracts are unchanged.

## Large-file ownership follow-up — 2026-08-03

- `transactions/pages/Detail.jsx` delegates remote state, command execution, payment confirmation, document actions and rental-deposit settlement state to `transactions/hooks/useTransactionDetail.js`.
- The page remains the presentation/orchestration owner; the hook is the transaction-detail runtime owner.
- Existing routes and API payloads are unchanged.
- Transaction detail presentation labels, modals and runtime side effects are separated so follow-up UI parity work can move through base components without rebuilding the route page.

## Regression guards

- `npm run check:maintainability` blocks V55/V66-style temporary file names and protects the transaction-detail split owners.
- The guard blocks company/department runtime scope keys such as `change_department`, `company_id` and `department_id` from returning to `src`.
- `check:all` now runs this guard after runtime closure so oversized route pages and missing hook/config/modal owners are caught before merge.
