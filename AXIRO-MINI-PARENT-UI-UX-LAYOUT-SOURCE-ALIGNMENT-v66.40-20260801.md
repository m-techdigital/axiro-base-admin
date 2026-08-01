# AXIRO Mini — Parent UI/UX/Layout Source Alignment v66.40

## Nguyên tắc

AXIRO cha là nguồn chuẩn. Mini chỉ khác phạm vi nghiệp vụ: một admin vận hành nhiều customer. Không port RBAC/company/project/team hoặc các domain nặng.

## Đối chiếu trực tiếp đã thực hiện

- `BaseButton`, confirm/delete action và modal/form footer giữ source parent hoặc adapter mỏng.
- Action table được sửa theo `renderActionsColumn.jsx` của AXIRO cha: mỗi `BaseButton` dùng `size="small"`, `type="default"`, `variant="outlined"`, gap 8, căn giữa; bỏ action rail border ngoài tự chế.
- Action column dùng `width/minWidth = 1`, không ép fixed-right, tự co theo nội dung.
- `BaseFilter` dùng markup/CSS action bar từ source cha: sort/reset/search chung một rail compact; field controls 36px, radius 8px.
- Table chỉ scroll ngang mặc định; không tạo vertical scroll container hoặc max-height ngầm.
- Layout class contract được đồng bộ về `admin-header-left`, `admin-trigger`, `admin-page-title`, `admin-content-body` và có alias tương thích.
- CSS sidebar/header/content/menu/card/table/filter/action được chắt lọc từ `admin-layout.scss` và `index.css` của AXIRO cha; không giữ action CSS suy diễn ở v66.39.3.

## Thành phần vẫn là bounded adapter

- `BaseFilter`: không port relation registry/cascade/RBAC.
- `BaseForm`: không port dynamic form engine khi Mini chưa có consumer.
- `BaseTable`: không port permission/action registry đầy đủ, nhưng giữ visual/action/scroll contract của cha.
- `BaseBreadcrumb` và header: không port global search/header filters theo các domain không tồn tại trong Mini.

## Gate

```bash
npm run check:parent-ui-source-alignment
npm run check:table-action-scroll
npm run check:all
```

Gate cũ `check:compact-action-rail` đã bị xóa vì bảo vệ implementation tự chế, trái source AXIRO cha.
