# AXIRO Parent Palette Sync - 2026-08-01

## Scope

This pass aligns the Mini admin palette with the AXIRO parent admin foundation. The parent admin source uses a navy/blue surface system centered on:

- page background `#eef5ff`;
- sidebar navy gradient `#03183f`, `#03122f`, `#061b45`;
- primary action blue `#1677ff` / `#0e5eff`;
- heading ink `#071c4d`;
- muted text `#64748b`;
- light borders around `#dce7f5`, `#d9e5f6`, `#edf2f7`.

## Changes

- `src/styles/tokens/admin-tokens.css` now defines the AXIRO parent blue/navy token set.
- Base statistic cards, neutral parent primitives, card-switch errors and number suffix controls now consume the shared tokens instead of hard-coded local colors.
- The customer storefront remains unchanged in this pass because it is not a direct `mylands-admin` surface and currently owns a separate dark marketplace/game visual language.

## Guardrail

Future Mini admin base UI should use `--axiro-*` tokens for primary, surface, border, text, status and shadow colors. Hard-coded colors are still acceptable only for one-off domain status labels or exact parent-source snapshots that are intentionally hash-locked.

