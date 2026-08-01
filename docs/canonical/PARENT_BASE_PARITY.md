# AXIRO Mini Parent Base Parity

AXIRO Mini Admin uses AXIRO parent base contracts where the Mini domain has the same need. Parity is behavioral, not name-only.

## Canonical owners

- `BaseModal`: close button, Escape, mask policy, footer order, body scrolling.
- `BasePageHeader`: breadcrumb, reload, declarative actions and action form modal.
- `BaseFilter`: grouped fields, compact/labeled modes, date ranges, sort, search/reset/change events.
- `BaseForm`: server validation mapping and scroll-to-first-error.
- `BaseListView`: header, statistics, filters, async state and table surface.
- `BaseTable`: action column, pagination meta, total count, horizontal scroll and sticky header.

## Bounded differences from AXIRO parent

Mini does not port permission checks, company/project context, relation cascades, saved views or dynamic workflow fields until those domains actually exist. The base API remains compatible enough to port a bounded module without creating a second framework.
