# Product-only / Transaction-first Notes - 2026-08-02

## Decision

Admin follows the MBN product-only marketplace model. Product is the sell/rent asset owner; Transaction is the operational workflow owner.

The standalone admin Contract module has been removed from the UI surface. Generated documents and document templates are the supported document entrypoints.

## Admin Surface

- Product management owns offer modes, approval, publish state and sale/rental pricing.
- Transaction detail owns payment, handover, return, dispute and generated-document visibility.
- Document Templates and Generated Documents replace standalone Contract CRUD.
- Marketplace Operations, Trust, Payouts, Payments and Wallets remain unchanged as supporting operation centers.

## Removed / Deprecated

- `/contracts` admin route, menu item and route constants.
- `src/modules/contracts` pages and service.
- Dashboard contract count as an independent KPI.
- Checks that required a contract list/form module.

## Merge Notes

- Do not restore Contract as a top-level admin module for MBN.
- If a legal artifact is needed, expose it through generated transaction documents.
- Keep parent base UI components and route metadata checks aligned with the product-only surface.
