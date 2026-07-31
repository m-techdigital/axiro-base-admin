# Development Merge Notes - axiro-base-admin - 2026-08-01

## Scope reviewed

This review covers the current development dependency and contract alignment updates for the admin app, including marketplace contract sync and package lock changes.

## Verification

- `npm run lint`
- `npm run build`
- `npm run check:system-v66`

All commands completed successfully.

## Known warnings

- ESLint reports 7 non-blocking `react-hooks/exhaustive-deps` warnings.
- Vite build reports a large Ant Design vendor chunk warning.
- The repo currently carries both `package-lock.json` and `yarn.lock`; pick one package-manager policy before release hardening.

## Development merge decision

Approved for development merge. The admin app builds and the system v66 contract passes.

## Release blockers

- `npm audit --audit-level=high` reports 10 vulnerabilities, including high severity advisories in `axios`, `react-router`, `vite`, `postcss`, `form-data`, `immutable`, `xlsx`, and transitive packages.
- This merge is not production-release clearance.
- Before release hardening, upgrade affected npm dependencies, clean lint warnings, settle package-manager policy, and rerun audit, lint, build, and system checks.
