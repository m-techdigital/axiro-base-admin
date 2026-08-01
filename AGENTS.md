# AGENTS — AXIRO Mini Admin

## Source of truth

1. Current code.
2. API contract and route metadata.
3. `docs/canonical` and linked ADRs.
4. Latest product decision.

## Parent alignment

AXIRO parent is the architecture standard. Mini reduces domain scope only. It must keep the same foundation patterns for layout, base components, API services, route ownership, validation and responsive behavior.

## Frontend rules

- Layout owner: `src/layouts/AdminLayout.jsx`.
- Menu owner: `src/config/adminMenu.jsx`.
- Route owner: `src/routes/adminRoutes.jsx`; metadata owner: `src/routes/meta.js`.
- Use exports from `src/components/base/index.js` before importing Ant Design primitives directly.
- Module pages must not import `Table`, `Modal`, `Drawer`, or `Form` directly when the base owner supports the use case.
- Lists use `BaseListView`/`BaseTable`; forms use `BaseForm`; overlays use `BaseModal`/`BaseDrawer`; headers use `BasePageHeader`.
- Styles use tokens/primitives under `src/styles`; do not add page-level layout owners without a real domain reason.
- Keep 401 refresh and 422 field-error mapping.
- Do not introduce RBAC/company/project dependencies into Mini.

## Verification

Run `npm run check:parent-foundation`, `npm run check:base-ownership`, all remaining `check:*`, lint and build.

## Parent UI parity

- List pages must use `BaseListView`, `BaseFilter`, `BaseTable` and canonical action owners.
- Do not add inline `Input.Search`, `Card` list wrappers or `Popconfirm` delete flows when a base owner exists.
- Run `npm run format`, `npm run check:parent-ui-parity` and `npm run check:all` before handoff.

## Parent-source selection policy

AXIRO cha là nguồn chuẩn trước khi thay đổi base/CSS. Mỗi owner phải được phân loại trong `docs/canonical/parent-base-provenance.json`:

- `exact_source`: copy nguyên source cha tại cùng contract;
- `bounded_adapter`: adapter mỏng vì Mini có phạm vi một admin, nhiều customer;
- `excluded`: không port vì lệch domain.

Không được tạo component mới chỉ cùng tên với AXIRO cha rồi gọi là đồng bộ. CSS base không được override trong `src/modules/**`.

## Parent-source rule

Do not create a second implementation merely because a component has the same name. Inspect the AXIRO parent source, its imports, CSS and consumers first. Copy dependency-closed sources exactly, use a thin adapter only for bounded Mini differences, and keep one CSS owner per primitive.
