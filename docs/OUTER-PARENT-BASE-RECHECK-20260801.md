# Outer Parent Base Recheck - 2026-08-01

## Scope

Checked the current outer parent repositories:

- `/Users/minhdc/Documents/Workspaces/bds-mylands/mylands-admin`
- `/Users/minhdc/Documents/Workspaces/bds-mylands/mylands-api`

This admin base must stay aligned with reusable AXIRO foundation code, but it must not import Mylands domain-heavy surfaces such as RBAC graph, company/project scope, accounting, reports, reservations, or inventory.

## Findings

- `mylands-admin` is clean on `develop` and remains the source reference for neutral admin UI primitives.
- `layout.css` in this repo was behind the parent token set. It now matches the parent foundation tokens, including touch height, spacing scale, surface/border tokens, safe-area handling, mobile navigation height, and sticky z-index.
- `responsive.css` now carries the newer parent page shell, section stack, filter bar, form grid, sticky action, scroll owner, touch surface, and responsive overlay primitives.
- `responsive.css` is intentionally recorded as a bounded adapter because Mini keeps runtime selectors such as `.app-page-scroll` and table scroll selectors required by the current admin pages.
- `BaseButton`, `BaseConfirmActionButton`, and `usePageHeaderActions` differ from the parent only through local formatter normalization. Their behavior remains parent-derived and hash-locked in the Mini provenance manifest.
- Parent-only components such as canonical hub, kanban, map, calendar, task tab, and rich editor remain excluded until Mini has real owned consumers.

## Merge Position

Development merge is acceptable for the admin base after this pass. Production release still requires dependency-audit remediation and any product-specific QA that sits above the base layer.

## Cleanup Note

- Removed local frontend build output from `dist`; it is generated output and should not be committed.
- No dependency `node_modules/**/dist` package internals were removed.
- Keep future build artifacts out of Git; regenerate them through `npm run build` when needed.
