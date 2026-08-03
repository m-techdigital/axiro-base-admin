# Large-file domain ownership closure

`marketplace-operations/pages/Index.jsx` is now the orchestration owner only.

- `components/operationsColumns.jsx` owns table presentation and compact row actions.
- `components/OperationsModals.jsx` owns fee-policy and operation-case modal forms.
- `config/options.js` owns tab, status and default fee-policy metadata.
- Source contracts follow these owners instead of requiring presentation code to remain in the page.
