# AXIRO Base Admin

Canonical React mini-base extracted from AXIRO/Mylands.

```bash
cp .env.example .env
npm ci
npm run lint
npm run build
npm run dev
```

## Dữ liệu mẫu MBN

Dashboard có bảng kịch bản dữ liệu mẫu. Tài khoản Admin: `admin` / `change-me`. Dữ liệu hiển thị đồng bộ với các tài khoản MBN `customer`, `seller`, `renter`, `lessor`, `dispute`.

## Parent-aligned foundation

Mini Admin follows AXIRO parent layout/base conventions. See `docs/canonical/README.md` and `docs/adr/0001-parent-aligned-foundation.md`.

## Parent-parallel foundation

Mini Admin follows the AXIRO parent folder and base-hook conventions. See `docs/canonical/PARENT_PARALLEL_DEVELOPMENT.md` and run `npm run check:parent-parallel-structure` before merge.

## Deep parent foundation

Xem `docs/canonical/DEEP_PARENT_FOUNDATION.md`. Mini dùng cùng query/action/error foundations với AXIRO cha nhưng không port RBAC, company/project hay domain nặng ngoài phạm vi.
