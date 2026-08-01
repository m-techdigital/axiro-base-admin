# AXIRO Mini Admin build closure v66.41.1

## Lỗi đã sửa

`src/components/base/renderers/index.js` export bốn renderer không được đóng gói: `users.jsx`, `code.jsx`, `identity.jsx`, `statistics.jsx`.

Bản v66.41.1 bổ sung nguyên source các renderer này từ AXIRO cha và thêm gate `check:renderer-closure` để mọi barrel export phải resolve tới file thực tế.

## Kiểm tra đã chạy

- Toàn bộ `scripts/check-*.mjs`: pass.
- Mọi relative import dưới `src`: resolve thành công.
- CSS brace balance và thứ tự `@import`: pass.
- Provenance manifest đã cập nhật đúng cho các bounded adapter hiện tại.
- `unzip -t`: pass.

`npm ci` không chạy được trong container do registry nội bộ thiếu `zustand@4.5.7`; cần chạy `npm run lint` và `npm run build` trên repository local có dependency đầy đủ.
