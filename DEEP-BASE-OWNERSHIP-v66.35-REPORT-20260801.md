# AXIRO Mini Deep Base Ownership v66.35

## Mục tiêu

Tiếp tục đồng bộ Mini với foundation của AXIRO cha mà không đưa RBAC, company scope, project/team hoặc các domain nặng vào Mini.

## Admin

- `BaseModal` sở hữu close, keyboard, mask policy, body scroll, max-height và footer action.
- `BaseFilter` hỗ trợ text, select, date, date range và sort selector.
- `BaseTable` sở hữu pagination summary, size, sticky header, horizontal scroll và action column.
- `BaseListView` dùng `BaseAsyncState` cho loading/error/empty.
- Bổ sung `BaseFormFooter` để form không tự dựng thứ tự nút.
- Bổ sung CSS responsive cho modal, footer, filter sort và async state.
- Gate `check:deep-base-ownership` ngăn base bị suy giảm.

## API

- Mở rộng `ListQueryRequest` cho document, audit và notification filters.
- `AuditLogController`, `GeneratedDocumentController`, `CustomerNotificationController` dùng `AppliesListQuery` và `ListQueryRequest`.
- Bổ sung `DeepBaseQueryAdoptionTest` để bảo vệ query foundation.

## Ranh giới nghiệp vụ

Không port RBAC, company/project/team scope, accounting, reports, HR/payroll hoặc workflow engine vào Mini.
