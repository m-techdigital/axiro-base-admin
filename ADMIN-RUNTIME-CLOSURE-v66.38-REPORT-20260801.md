# AXIRO Mini Admin Runtime Closure v66.38

## Phạm vi

Bản này đóng các lỗi thực thi phát hiện sau v66.37:

- loại import `src/styles/base-modal.scss` không tồn tại;
- chuyển stylesheet modal sang owner CSS toàn cục đã được chuyển đổi từ AXIRO cha;
- bảo đảm toàn bộ `@import` đứng trước rule CSS;
- xử lý bảy cảnh báo `react-hooks/exhaustive-deps`;
- không làm thay đổi nghiệp vụ module.

## Quyết định kiến trúc

`ParentBaseModal.jsx` không còn được khai báo `exact_source`, vì Mini không dùng Sass toolchain. Nó là `bounded_adapter`: JSX được lấy từ cha, bỏ duy nhất side-effect import SCSS, còn CSS được chuyển cơ học sang `parent-base-modal.css`.

## Gate

```bash
npm run check:admin-runtime-closure
```

Gate kiểm tra import CSS, stylesheet modal và dependency contract của bảy hook đã sửa.
