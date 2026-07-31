# AXIRO Mini Admin — phát triển song song với AXIRO cha

AXIRO Mini dùng cùng convention nền tảng với AXIRO cha nhưng chỉ giữ tập chức năng Marketplace cần thiết.

## Cấu trúc canonical

- `src/app/router`: owner lắp route.
- `src/configs`: menu và cấu hình dùng chung; `src/config` chỉ là compatibility re-export.
- `src/layouts`: `AdminLayout`, `AdminHeader`, `AdminSidebar`.
- `src/middleware`: route guards.
- `src/hooks`: base hooks; mọi export đi qua `src/hooks/index.js`.
- `src/components/base`: form/table/modal/drawer/list/page primitives.
- `src/services`: axios, base service, API paths và endpoints.
- `src/modules/<domain>`: chỉ chứa service/page/config đặc thù nghiệp vụ.

## Base hooks được đồng bộ

`useAsyncAction`, `useAuth`, `useBaseFilters`, `useDetail`, `useFormActionModal`, `useIsMobile`, `useList`, `useModulePageData`, `usePageHeaderActions`, `useRelationOptions`, `useRouteMeta`, `useServiceOverview`, `useStatistics`, `useTimeline`.

Không copy hook nghiệp vụ nặng từ AXIRO cha nếu Mini chưa có module tương ứng. Khi cùng một nhu cầu xuất hiện ở cả hai dự án, ưu tiên giữ cùng tên, input/output contract và vị trí file.

## Quy tắc

1. Không tạo `AppLayout` hoặc router owner thứ hai.
2. Không import trực tiếp Ant `Table`, `Modal`, `Drawer`, `Form` trong module nếu base đã có.
3. Không tạo hook cục bộ trùng base hook.
4. Mọi thay đổi foundation phải cập nhật gate `check:parent-parallel-structure`.
