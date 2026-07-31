# AXIRO Mini Admin integration boundary

- `src/contracts/marketplace-contract.json` is copied from AXIRO Mini API and must not be edited independently.
- Admin may use only `admin_endpoints` and public endpoints.
- Admin owns review, reconciliation, dispute resolution, document template management and internal audit views.
- Customer-facing state changes remain Backend-owned and are never reimplemented in Admin.
- Run `npm run check:api-contract` before every merge.
