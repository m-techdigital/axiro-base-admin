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
