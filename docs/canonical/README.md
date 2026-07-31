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
