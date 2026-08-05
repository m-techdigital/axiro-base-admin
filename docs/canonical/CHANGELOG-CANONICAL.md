## 2026-08-05 — Direct escrow agreement flow

- Added a private escrow invitation flow that does not require a public marketplace listing.
- The initiator selects buyer/seller role, counterparty username, asset terms, amount, delivery method and inspection policy.
- No payment obligation is created until both parties accept the immutable agreement snapshot.
- Accepted agreements reuse canonical payment, handover, dispute, document, settlement and payout owners.

# Canonical Changelog

## Baseline 2026-08-04

### Architecture

- Giữ mô hình một Admin, nhiều khách hàng và phân loại `mini_bounded`.
- Không port runtime company, department, employee, HR, accounting, report, project hoặc RBAC phức tạp.
- Tách các service/page/CSS lớn theo owner thật, giữ facade khi cần bảo toàn caller và transaction boundary.

### API

- Transaction lifecycle tách payment plan, payment capture, settlement, dispute resolution và action policy.
- Withdrawal transition tách khỏi facade; payout seed idempotent và wallet ledger nhất quán.
- Document generation tách payload builder/renderer.
- Document template đã dùng là bất biến; successor version không được branch từ bản cũ.
- Fresh seed có public products bán/thuê/trả góp, wallet/payout, trust/risk, issued documents và transaction states.
- Customer isolation bao phủ transaction, wallet, payout và document.

### Admin

- Initial JS giảm từ khoảng 1.39 MB xuống khoảng 290 KB sau khi AntD/@ant-design/rc bypass generic vendor.
- Login dùng lightweight form; transaction panels, notification drawer và operations tabs/modal được lazy-load.
- BaseForm dùng semantic 12-column grid; BaseFilter responsive và auto-search.
- Duyệt dùng confirm; từ chối dùng form modal và lý do bắt buộc.
- Audit/generated documents dùng base list/table; enum labels qua canonical owner.
- Browser CRUD strict mode bắt buộc document-template version mutation trên fresh seed.

### MBN React

- Page lớn tách hook/presentation owner; content data lazy-load theo nhóm.
- SCSS/CSS tách theo domain và import manifest.
- Purchase/rental/payment/payout UI dùng lifecycle guidance; không hard-code tỷ lệ hoàn tiền.
- Browser smoke kiểm avatar persistence, offer mode, payment modal và responsive overflow.

### Release

- Contract version `2026-08-04.1` đồng bộ ba repo.
- Release package guard chặn env/dependencies/build/cache/folder bọc ngoài.
- `release:all` chạy fresh DB, tests, build, browser, transactional E2E, DOCX render và ZIP integrity.
- Finalizer PHP chỉ promote runtime evidence khi release summary `passed` và hash khớp ba HEAD.

## Historical closure notes

Các file canonical có ngày trong tên được giữ làm evidence lịch sử. Nội dung đã hợp nhất ở đây; chúng không còn là nguồn trạng thái hiện tại.

## Owner split follow-up — 2026-08-05

- Admin `BaseForm` delegates AntD field controls to `BaseFormControl`; `BaseFilter` delegates filter controls to `BaseFilterControl`; `BaseTable` delegates empty presentation to `BaseTableEmptyState`. Public props and marketplace behavior remain unchanged.
- Reconciliation export progress is a demand-loaded owner and keeps a visible, accessible loading fallback instead of rendering an empty gap while the chunk loads.
- MBN global `app.css` no longer imports modal sub-owners twice. Account, purchase-detail and content-route styles remain owned by their route shells/pages. `check:global-style-boundary` prevents route-only styles from leaking back into the global manifest.
- No API schema, route, transaction, payout, document, customer-isolation or marketplace contract changed in this follow-up.
- All prior bundle sizes, browser screenshots, transactional E2E and release evidence are historical after this source change. Fresh build, visual regression and `release:all` are required from clean committed/pushed Git HEADs.
## 2026-08-05 route closure and CSS ownership continuation

- Admin: Transaction Command Center presentation was split into lazy guidance, workflow, and pending-payment owners with visible loading fallbacks.
- MBN: modal and purchase-modal styles moved from global manifests to the components that consume them.
- API runtime and marketplace behavior are unchanged.
- Previous bundle/browser evidence is historical after this source change; rerun build, visual regression, transactional E2E, and `release:all` on clean pushed Git HEADs.

## 2026-08-05 — Digital asset escrow handover

- Added Mini-bounded escrow handover policy for game accounts and in-game items.
- Reused canonical transaction, payment, snapshot, dispute, document and payout owners.
- Browser/release evidence must be regenerated after this source change.


### Escrow document and demo closure

- Marketplace documents use transaction-level immutable handover snapshots for both game accounts and in-game items.
- The handover and safety-check templates include delivery method, inspection duration/deadline, evidence requirement, and non-sensitive confirmation notes.
- Demo and transactional E2E source cover an `in_game_trade` item flow in addition to account rental/sale flows.
- Secret credentials remain explicitly excluded from database fields, document merge data, notes, and browser forms.

## 2026-08-05 — Digital asset escrow source-package closure

- Removed browser evidence directories from Admin/MBN source trees and removed API `public/storage` runtime content from the source package.
- Release-package guards now fail closed on `artifacts`, coverage/build output and API public runtime storage; regression probes confirmed the guards reject these paths before packaging.
- Digital asset escrow source/static guards pass across API, Admin and MBN. Runtime browser, transactional E2E, `release:all` and hash-finalized evidence remain pending until the source is committed and pushed in the three Git repositories.

## 2026-08-05 — Escrow Box private module

- Replaced username-based direct escrow with a dedicated private Escrow Box aggregate.
- Added one-time hashed invite claim, alias-only customer presenter and contact-information validation.
- Added versioned agreement, Admin review, fee rule/snapshot/override, payment obligations and ordered handover checkpoints.
- Added private optimized media pipeline and dispute retention lock.
- Reused canonical transaction payment, wallet, settlement, dispute, document and payout owners.
- Runtime browser/E2E/release evidence is pending after this source change.

## 2026-08-05 184710 style-baseline carry-forward

- The MBN 184710 deterministic stylesheet manifest, desktop/mobile shell owners, and style architecture guards are retained as the active UI baseline.
- Escrow Box routes, hooks, repositories, privacy contract, and media/handover flows are carried forward onto that baseline.
- Escrow Box CSS is registered once in `src/index.css`; route components do not side-effect import CSS.
- API/Admin Escrow Box owners remain `mini_bounded`; no company, RBAC, HR, accounting, report, or project runtime is introduced.
- Previous build/browser/release evidence is stale after this merge and must be regenerated from clean pushed Git HEADs.
