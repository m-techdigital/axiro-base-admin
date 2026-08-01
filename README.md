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

## AXIRO parent source alignment

Base code must be selected from the AXIRO parent repository before Mini adds a new owner. Every shared owner is classified in `docs/canonical/parent-base-provenance.json` as an exact source copy, a mechanical toolchain conversion, a thin bounded adapter, or an explicit exclusion. Run `npm run check:parent-dependency-closure` before merging changes to base components or base CSS.

## v66.46 shared foundation selection

BaseView and the parent field-rendering contract are now adopted by transaction detail with source-closure gates. See `docs/canonical/AXIRO-MINI-SHARED-FOUNDATION-SELECTION-v66.46-20260801.md`.
