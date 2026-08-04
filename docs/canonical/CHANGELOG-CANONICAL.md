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
