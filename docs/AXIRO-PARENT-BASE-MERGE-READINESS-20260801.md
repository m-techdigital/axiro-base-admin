# AXIRO Parent Base Merge Readiness - axiro-base-admin - 2026-08-01

## Scope reviewed

This review covers the latest base synchronization from the AXIRO parent admin (`mylands-admin`) into the mini admin app. The update expands source-aligned base components, renderers, modal/form/action ownership, admin runtime closure checks, table action scrolling, operational readiness, and parent provenance controls.

## Verification

- `npm run build`
- `npm run check:all`

All commands completed successfully.

## Optimizations made during review

- Updated parent provenance hashes for the approved Mini adapters/copies so the dependency closure gate validates the current synchronized base.
- Added payment setting history and activate endpoints to the admin API contract mirror to match the backend route surface.
- Excluded `vendor/` from ESLint scanning so Admin lint stays scoped to frontend source and does not lint backend/vendor artifacts.

## Known warnings

- ESLint reports one non-blocking `react-hooks/exhaustive-deps` warning in `src/modules/payment-settings/pages/Index.jsx`.
- Vite reports a large bundle chunk warning.
- The repo still carries both `package-lock.json` and `yarn.lock`; settle package-manager policy before release hardening.

## Development merge decision

Approved for development merge. Parent source alignment, dependency closure, renderer closure, base ownership, interaction parity, deep ownership, route/API contracts, operational readiness, format, lint, and build all pass without blocking errors.

## Release blockers

- `npm audit --audit-level=high` reports 10 vulnerabilities, including 8 high severity advisories.
- This is not production-release clearance. Upgrade affected npm packages, clean warnings, settle lockfile policy, and rerun audit, build, and `check:all` before release hardening.
