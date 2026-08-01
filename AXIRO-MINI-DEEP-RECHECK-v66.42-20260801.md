# AXIRO Mini Deep Recheck v66.42

## Mục tiêu

Rà lại các yêu cầu đã nêu sau v66.41.1, tập trung vào lỗi bỏ sót có thể làm build hoặc UI không đồng bộ: dependency closure, raw Ant Design consumers, enum hiển thị thô và việc dùng base owner trong module.

## Sửa trực tiếp

- Chuyển toàn bộ `Button` còn dùng trực tiếp trong `src/modules/**` sang `BaseButton`.
- Giữ `BaseFormFooter` và các source copy từ AXIRO cha theo provenance; không sửa implementation cha chỉ để thỏa gate.
- Bổ sung `src/constants/options.js` làm owner cho nhãn customer/product/contract/transaction/document/audit/case/content/review.
- Loại các option dạng `label: value` ở module, tránh hiển thị enum tiếng Anh thô.
- Bổ sung `check:source-closure` kiểm tra mọi local import/alias import resolve và mọi package import đều khai báo trong `package.json`.
- Bổ sung `check:base-consumer-adoption` để chặn module quay lại raw `Button`, raw DOM button trong action column và raw enum option labels.
- Hai gate mới đã được đưa vào `check:all`.

## Kiểm tra đã chạy

- Toàn bộ `scripts/check-*.mjs`: pass.
- Mọi import tương đối và alias `@/`: resolve.
- Mọi package import: đã khai báo.
- Renderer barrel closure: pass.
- CSS runtime/source/dependency ownership gates: pass.
- ZIP integrity: pass.

## Giới hạn còn lại

Bản này chưa tuyên bố full parity với AXIRO cha cho:

- `BaseForm` schema engine đầy đủ;
- field registry của editor/upload/image-upload/dynamic-list;
- file service và upload endpoint;
- BaseTable column registry, saved views, inline editing và action coordinator;
- document authoring/generation lifecycle hoàn chỉnh.

Những phần trên cần được port theo dependency closure thực tế, không tạo component cùng tên nhưng khác hành vi.

## Xác minh runtime bắt buộc tại máy phát triển

```bash
npm ci
npm run format
npm run format:check
npm run check:all
npm run lint
npm run build
```

Môi trường đóng gói không cài được `zustand@4.5.7` từ registry nội bộ nên không thể xác nhận Vite build tại container.
