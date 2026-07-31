# ADR 0001: AXIRO parent-aligned foundation

## Decision
AXIRO Mini dùng foundation của AXIRO cha cho layout, base components, API response, validation và pagination. Mini khác về phạm vi module, không khác về cách tổ chức nền tảng.

## Consequences
- Module mới phải tìm base trước khi tự dựng UI.
- Controller API không tự lặp response/pagination/validation nếu đã có owner chung.
- Không nhập các dependency nghiệp vụ nặng của AXIRO cha vào Mini.
