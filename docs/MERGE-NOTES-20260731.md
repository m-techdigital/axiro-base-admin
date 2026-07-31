# Merge Notes - axiro-base-admin - 2026-07-31

## Merge scope

This merge captures the current development dependency alignment needed for the admin Vite/Tailwind setup.

## Verification completed

- `npm run lint`
- `npm run build`
- `npm run check:system-v66`

All commands completed successfully.

## Development acceptance

The code is acceptable to merge into the active development branch. The build now resolves the Tailwind Vite plugin dependency used by `vite.config.js`.

## Known follow-up items

- `npm audit --audit-level=high` reports high severity advisories in the frontend dependency tree, including `axios`, `react-router`, `vite`, and related transitive packages.
- ESLint reports 7 existing `react-hooks/exhaustive-deps` warnings. They do not block the current build, but should be cleaned up.
- The repo currently contains both `package-lock.json` and `yarn.lock`; choose a single package-manager policy before release hardening.
- Generated `dist/`, local env files, and `node_modules/` remain ignored and must not be committed.

## Merge decision

Proceed with development merge. Track dependency remediation and lint cleanup separately before production release.
