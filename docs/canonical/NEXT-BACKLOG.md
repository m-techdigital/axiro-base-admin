# Next Backlog

## Bắt buộc trước tag baseline mới

1. Chạy `composer release:all` trên fresh test DB với browser credentials và LibreOffice.
2. Bắt buộc document-template mutation non-skip: issued template -> successor version -> `supersedes_template_id` đúng.
3. Chạy `composer release:finalize-evidence` từ ba HEAD sạch, đã push và khớp release summary.
4. Commit/push evidence final bằng hash thật; không dùng trạng thái workspace hoặc log cũ.

## Tối ưu có số đo

1. Đo lại Admin route closures sau lightweight Login, lazy transaction panels, notification drawer và operations tabs.
2. Chỉ tối ưu route vượt budget dựa trên `dist/bundle-report.json`; không gom lại AntD/rc vào vendor chung.
3. Chạy browser visual QA cho BaseForm/BaseFilter/review modal/table tại desktop, tablet và mobile.

## Nghiệp vụ tiếp theo

1. Bổ sung fixture browser ổn định cho mọi lifecycle action cần test lặp lại.
2. Mở rộng customer isolation cho endpoint mới khi phát sinh.
3. Giữ scope runtime ở customer/product/transaction/payment/wallet/payout/document/support/trust.
