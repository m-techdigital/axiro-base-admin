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

### 2026-08-06 — Admin-assigned Escrow Box

- Admin can create a box, select two active customers, and receive two separate customer-bound acceptance links.
- Both parties must accept the same agreement version before Admin review starts.
- Third parties cannot preview or accept a leaked link.
- Admin can rotate links only for parties that have not accepted.
- Runtime lint/build/Pint/PHPUnit/browser/E2E evidence must be regenerated after this source change.

## 2026-08-06 - Escrow Box validation and invitation lifecycle

- Unified customer create/edit validation through shared BaseForm owners and nested field-error mapping.
- Fixed React hook order in Escrow Box detail.
- Excluded top-up fields for horizontal exchange.
- Hardened phone invite lookup, cancellation, replacement, notification, and row-lock behavior.
- Kept privacy aliases and Mini-bounded financial owners unchanged.
## 2026-08-06 — Escrow Box candidate resolution and update history

- Lời mời Bên B chuyển sang hai bước: tìm chính xác bằng số điện thoại, xem ứng viên đã che thông tin, sau đó chọn ứng viên mới gửi lời mời.
- Customer API không trả customer id; candidate token được mã hóa, gắn với Box/người tạo và hết hạn sau 10 phút.
- MBN detail có nút tải lại và nút Cập nhật Box; nút Hủy trang cập nhật nằm ngoài form và căn phải.
- Admin detail hiển thị lịch sử từng phiên bản điều khoản, lý do, người cập nhật và snapshot chi tiết.
- Contract nâng lên 2026-08-06.4; runtime/browser evidence phải chạy lại sau source change.

## 2026-08-06 — Escrow Box UI regression closure

- Không hiển thị copy kỹ thuật về độ dài/implementation validation trên customer UI; form chỉ hướng dẫn hành động người dùng.
- Detail phải bọc các `PageSection` trong `PageStack`/owner spacing; card không được dính liền do render trực tiếp dưới `PageShell`.
- Nút hủy/clone là lifecycle action độc lập, `type=button`, nằm ngoài mọi form và căn phải trong action bar riêng.
- Admin lịch sử điều khoản và sự kiện dùng Timeline owner theo pattern AXIRO Cha, có actor, thời gian và snapshot mở rộng; không quay lại bảng lịch sử ghép ô.
- Static guards khóa cả bốn regression trên để tránh tái diễn.

## 2026-08-06 — Escrow Box update action placement

- Nút `Cập nhật` được đặt cùng action bar vòng đời ở cuối trang chi tiết, ngay trước `Hủy box`.
- Action dùng `type="button"`, nằm ngoài mọi form và điều hướng tới route cập nhật riêng `/account/escrow-boxes/:id/edit`.
- Không đặt lại action cập nhật trong header để tránh tách rời nhóm thao tác vòng đời và tránh lặp UI.
- Static guard MBN khóa thứ tự `Cập nhật` → `Hủy box` và sự tồn tại của trang cập nhật riêng.

- Escrow Box: nút Cập nhật dùng quyền `can_update` từ API và hiển thị cả khi đang chờ Bên B chấp nhận; cập nhật trước acceptance giữ nguyên trạng thái/lời mời hiện tại.
- Escrow Box update UX closure: action label is now `Cập nhật`; `Hủy` and `Cập nhật` share one right-aligned action row outside the form on desktop, with an intentional two-column mobile layout. Static guards prevent the old `Lưu phiên bản mới` label and accidental line breaks from returning.

## 2026-08-06 — Escrow Box success feedback closure

- Tạo Box thành công phải phát toast xác nhận và chuyển thẳng đến Detail của Box vừa tạo.
- Raw invite path vừa tạo được truyền bằng route state để Detail có thể hiển thị/sao chép trong phiên điều hướng đầu tiên mà không lưu raw token vào database.
- Cập nhật Box thành công phải phát toast xác nhận, refresh form theo response/version mới và giữ nguyên trang cập nhật.
- Lỗi validation/request vẫn giữ tại form và từng field; không điều hướng khi mutation thất bại.
- MBN static guard khóa hai hành vi success trên và cấm khôi phục trang success trung gian sau create hoặc redirect sau update.

## 2026-08-06 — Parent activity timeline alignment

- AXIRO Cha `ActivityResource`/`BaseTimeline` contract is now the shared standard for Escrow Box activity history.
- Mini keeps a bounded domain adapter: `EscrowBoxEvent` remains the domain event store, while `EscrowBoxTimelineService` maps it to the parent activity keys (`activity_type`, `activity_subtype`, `old`, `new`, `changed_by`, `created_at`).
- Admin renders history through shared `BaseTimeline`; module code no longer owns a second AntD Timeline/table implementation.
- Customer output keeps the same event description contract but aliases actors as Bên A/B/Nền tảng and never exposes counterpart identity.

## 2026-08-06 — Parent Activity Timeline runtime closure

- `useTimeline` dùng nguyên source AXIRO Cha; `BaseTimeline`, `TimelineChangeItem` và CSS là bounded adapter do AXIRO Mini không mang Tailwind/company/RBAC runtime.
- Contract `2026-08-06.6` / API `v70` khai báo rõ cả hai endpoint timeline Escrow Box cho Admin và Customer.
- Backend timeline lọc và phân trang tại SQL boundary, chỉ tải actor và agreement version cần cho trang hiện tại; cấm tải toàn bộ event collection rồi phân trang trong PHP.
- Customer timeline tiếp tục che actor thành Bên A/B/Nền tảng và không trả customer id hoặc tên đối tác.
- `terms_updated` trả old/new đã qua `AuditPayloadSanitizer`; filter `activity_type` và `activity_subtype` được khóa bằng test.
- Static/source/package gates đã chạy lại; Pint, PHPUnit, frontend lint/build, browser và release evidence phải chạy lại trên Git HEAD có dependency đầy đủ.

## 2026-08-06 — Source package cache closure

- API source package đã loại `bootstrap/cache/packages.php` và `bootstrap/cache/services.php`; đây là Composer/Laravel generated cache, không phải source.
- `check-release-package.php` và `check-recovery-baseline.php` hiện fail-closed với mọi file trong `bootstrap/cache/**` ngoại trừ `.gitignore`.
- Regression probe đã xác nhận cả hai checker đều fail khi cố tình thêm lại generated cache.

## 2026-08-06 — Runtime dependency, PHPUnit style và BaseForm controlled bridge closure

- Admin `BaseFormControl` bắt buộc chuyển tiếp `value`, `onChange`, `onBlur`, `id` và accessibility props do Ant Design `Form.Item` inject vào control. Việc bọc control nhưng làm rơi các props này khiến người dùng đã nhập dữ liệu nhưng form vẫn báo `required`.
- API là PHPUnit thuần; Pest DSL (`it`, `expect`, `describe`) bị cấm và được khóa bởi `check-phpunit-style.php`.
- MBN có `doctor:dependencies` để phát hiện `node_modules` cài thiếu/hỏng trước khi chạy Vite. Lỗi thiếu `vite/dist/...`, `react-dom/cjs/...` hoặc Ant Design là lỗi dependency installation, không phải route source fallback.

## 2026-08-06 — Parent BaseForm canonical synchronization

- `BaseForm.jsx`, `BaseFormModal.jsx`, `BaseFormFooter.jsx` and the `BaseForm/*` lifecycle helpers now follow the reviewed AXIRO parent source.
- Field rendering now uses the parent `fieldRegistry` + adapter architecture and `FieldContainer`; the Mini-only `BaseFormControl` is no longer the renderer owner of `BaseForm`.
- Laravel validation mapping, first-error tab focus/scroll, conflict handling, cancel veto, submit single-flight policy, relation cascade, computed fields, and controlled `Form.Item` wiring are inherited from the parent foundation.
- Mini keeps only a bounded `money` alias and excludes parent-only upload/editor/location/dynamic-form capabilities that are outside the current Mini runtime.
- `check:parent-base-form` prevents a return to a parallel renderer or loss of the parent validation lifecycle.
