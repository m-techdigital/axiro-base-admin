# Architecture
React + Vite + Ant Design Admin following AXIRO parent base conventions with Mini-bounded scope. Lists use base list/table/filter owners, forms use BaseForm/BaseFormPage and transaction detail is split into presentation/action panels.

Recent split boundaries:

- Relation option behavior is separated into resolver, cache and normalizer owners under `src/hooks/relation/*`.
- `useRelationOptions.jsx` remains the React hook coordinator only.
- Transaction detail sections live under `src/modules/transactions/components/detail/*`.

Do not import parent company/RBAC/project/accounting/report dependencies or duplicate base components with similar names but different behavior.
