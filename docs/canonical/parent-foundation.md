# Parent-aligned Admin Foundation

## Goal
Keep AXIRO Mini Admin structurally compatible with the AXIRO parent while retaining only marketplace modules.

## Canonical owners
- Layout: `AdminLayout`, `AdminHeader`, `AdminSidebar`.
- Menu: `adminMenu.jsx`.
- Routes: `adminRoutes.jsx`; page titles: `meta.js`.
- UI: `components/base` barrel.
- Data: `createCrudService`, `useList`, `useDetail`.
- Theme: `admin-tokens.css`; common responsive behavior: `admin-foundation.scss` with owner partials under `styles/primitives/admin-foundation/`.

## Forbidden drift
Module code must not create another generic table, modal, drawer, form, page header or global layout owner.
