# AXIRO Mini table action and scroll closure v66.39.2

## Scope

This closure corrects two regressions in the v66.39.1 Admin package:

- operational row actions that still rendered raw Ant Design text buttons;
- `BaseTable` creating an unnecessary vertical scrolling region.

## BaseTable

`BaseTable` no longer enables sticky headers by default. The table keeps horizontal scrolling through Ant Design's `scroll.x`, while its container and body no longer impose vertical overflow or an implicit maximum height.

Pages that genuinely need sticky behavior can still pass `sticky` explicitly.

## Row actions

Compact row actions were moved to `BaseIconAction` with tooltips and accessible labels in the following areas:

- Products;
- Contracts;
- Transactions;
- Generated documents;
- Document templates;
- Wallets;
- Payouts;
- Marketplace operations;
- Marketplace trust;
- Audit logs;
- Action Center operational links where appropriate.

Long workflow actions inside modal footers and forms remain labeled buttons because their text communicates consequential business decisions.

## Regression gate

The new `check:table-action-scroll` gate verifies:

- sticky headers are opt-in;
- horizontal scrolling does not create a vertical scroll container;
- the table body has no implicit maximum height;
- core operational lists use `BaseIconAction` for compact row actions.
