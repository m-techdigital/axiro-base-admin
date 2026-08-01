# AXIRO Mini Base Runtime & Field Closure v66.41

- Sửa filter search bị lặp icon và reset/search không phát query đúng.
- Sửa `entityLabel` không còn lọt xuống DOM.
- Sửa Drawer `width` deprecated bằng adapter `size`.
- Sửa Form.useForm warning bằng modal `forceRender`.
- Sửa row key fallback của BaseTable.
- Khóa table chỉ scroll ngang, không tạo scroll dọc nội bộ.
- Port exact các hook domain-neutral: useActiveTab, useBreadcrumb, usePageMeta, usePageTitleOverride và route matcher.
- Port option renderer của AXIRO cha và RelationSelect source-derived, loại prop `form` khỏi DOM Select.
- Bổ sung grid span 12 cột cho form layout.

Chưa port editor/upload đầy đủ vì cần dependency closure và service upload tương ứng; không thay bằng editor/upload tự chế.
