# AXIRO Filter Control Height Sync - 2026-08-01

## Scope

This pass normalizes Mini admin filter controls to the AXIRO parent base control height token.

## Changes

- `BaseFilter` inputs, selects, date pickers and action buttons now use `--app-control-height`.
- `BaseHeaderFilters` search and range controls now use the same token instead of a separate 40px height.
- Select placeholder/item line-height and header filter input line-height are derived from the token to avoid Ant controls visually growing taller than neighboring inputs.

## Guardrail

Future filter UI should not hard-code 40px/44px heights unless it is a touch-only mobile surface. Desktop filter rows should use `--app-control-height` so search, select, date picker, range picker and action icon buttons align on the same row.

