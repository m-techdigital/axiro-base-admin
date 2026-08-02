# Marketplace hardening 2026-08-02

## Pham vi dong bo tu AXIRO cha

- Nguon doi chieu: `mylands-api-develop-20260802-0359.zip` va `mylands-admin-develop-20260802-0359.zip`.
- Dot nay admin chua thay doi UI, nhung da ghi nhan manifest canonical de doi chieu cac phan backend/customer moi.
- Khong keo vao base admin cac module company, project, team, Reservation/CRM ownership chain, Accounting posting, RBAC graph, inventory hay report.

## Tac dong len admin

- Backend da co idempotency checkout, optimistic availability version, expire hold va money math decimal.
- Customer app da gui `availability_version` va `idempotency_key` khi tao giao dich.
- Admin nen uu tien bo sung cac man hinh quan tri lifecycle thay vi mo rong sang hop dong rieng, vi MBN hien product-only transaction-first.

## Dau viec nen bo sung cho admin

1. Man hinh hold monitor: san pham dang hold, sap het han, da expire, nguon hold, buyer va transaction.
2. Timeline availability trong chi tiet san pham: from/to status, actor, source, note, hold expiry va version.
3. Hang doi transaction can xu ly: pending payment qua han, delivery tre, acceptance tre, dispute dang mo.
4. Idempotency audit: request key/hash, lan lap checkout, transaction duoc tra lai.
5. Tac vu release hold co note bat buoc, canh bao truoc khi override nguon hold.
6. Bang doi soat wallet/payout/refund: before/after balance, escrow release, deposit refund.
7. Bo loc availability status va stale hold tren danh sach san pham.
8. Checklist tai lieu bang chung theo giao dich: snapshot, proof thanh toan, proof ban giao, acceptance/dispute.
9. Canh bao spam hold hoac checkout nhieu lan theo buyer/product trong khoang thoi gian ngan.
10. Dashboard SLA theo tung buoc nghiep vu de admin nhin duoc diem nghen.

## Ghi chu UI/UX

- Khi phat trien cac man moi, dung lai token mau, button, input height va active state da dong bo voi AXIRO cha.
- Trang quan tri nen uu tien table/filter/action ro rang, khong tao layout marketing/card long nhau.
- Cac enum status phai hien label tieng Viet, khong hien raw value.

## Trang thai kiem tra

- `npm run check:all`: pass.
- `npm run build`: pass, con warning chunk lon cua Vite nhu truoc.
