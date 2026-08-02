# Marketplace hardening 2026-08-02

## Pham vi dong bo tu AXIRO cha

- Nguon doi chieu: `mylands-api-develop-20260802-0359.zip` va `mylands-admin-develop-20260802-0359.zip`.
- Admin da bo sung man hinh `operations-control` de quan ly cac dau viec van hanh marketplace moi.
- Khong keo vao base admin cac module company, project, team, Reservation/CRM ownership chain, Accounting posting, RBAC graph, inventory hay report.

## Tac dong len admin

- Backend da co idempotency checkout, optimistic availability version, expire hold va money math decimal.
- Customer app da gui `availability_version` va `idempotency_key` khi tao giao dich.
- Admin da co hold monitor, transaction queue, canh bao checkout lap, reconciliation, document checklist va manual release hold.
- Module van giu product-only transaction-first, khong mo rong sang hop dong rieng.
- Khong dung `/contracts` nhu module CRUD rieng; ho so/tai lieu chi nam trong ngu canh giao dich.

## Trang thai dau viec admin

1. Da co: hold monitor, availability timeline, transaction queue, canh bao checkout lap, manual release hold, reconciliation va document checklist.
2. Da co: filter availability/version tren danh sach san pham.
3. Can phat trien tiep: badge/counter thong bao nhe cho viec can xu ly.
4. Can phat trien tiep: action nhanh tu transaction detail.
5. Tam khong phat trien: fraud engine, SLA engine, role/policy nhieu cap, report/BI rieng.

## Ghi chu UI/UX

- Khi phat trien cac man moi, dung lai token mau, button, input height va active state da dong bo voi AXIRO cha.
- Trang quan tri nen uu tien table/filter/action ro rang, khong tao layout marketing/card long nhau.
- Cac enum status phai hien label tieng Viet, khong hien raw value.

## Trang thai kiem tra

- `npm run check:all`: pass.
- `npm run build`: pass, con warning chunk lon cua Vite nhu truoc.
