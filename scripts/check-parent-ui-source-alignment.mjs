import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const fail = (message) => {
    console.error(message)
    process.exit(1)
}

const actionGroup = read('src/components/base/BaseActionGroup.jsx')
const iconAction = read('src/components/base/BaseIconAction.jsx')
const filter = read('src/components/base/BaseFilter.jsx')
const table = read('src/components/base/BaseTable.jsx')
const layout = read('src/layouts/AdminLayout.jsx')
const header = read('src/layouts/components/AdminHeader.jsx')
const css = read('src/styles/primitives/admin-foundation.css')
const parentActionRenderer = read('src/utils/renderActionsColumn.jsx')

if (css.includes('.base-action-group__item + .base-action-group__item')) {
    fail(
        'Không được giữ action rail tự chế; AXIRO cha dùng từng BaseButton outlined với gap.',
    )
}
if (
    !actionGroup.includes(
        "type={action.buttonType || action.type || 'default'}",
    )
) {
    fail(
        'BaseActionGroup phải giữ default outlined button contract của AXIRO cha.',
    )
}
if (!actionGroup.includes("variant={action.variant || 'outlined'}")) {
    fail('BaseActionGroup phải dùng outlined variant theo AXIRO cha.')
}
if (!iconAction.includes("type = 'default'")) {
    fail('BaseIconAction phải có border mặc định, không dùng text button.')
}
if (!parentActionRenderer.includes('variant="outlined"')) {
    fail('Action renderer phải dùng BaseButton outlined giống AXIRO cha.')
}
if (
    !css.includes('.base-filter-actions') ||
    !css.includes('.base-filter-action + .base-filter-action')
) {
    fail('Filter action group phải giữ CSS source-derived từ AXIRO cha.')
}
if (
    !filter.includes('base-filter-actions-col') ||
    !filter.includes('base-filter-action--search')
) {
    fail('BaseFilter phải dùng action markup tương thích AXIRO cha.')
}
if (
    !table.includes('width: column.width ?? 1') ||
    table.includes("fixed: column.fixed ?? 'right'")
) {
    fail(
        'Action column phải tự co theo parent contract, không ép fixed/right hoặc width lớn.',
    )
}
if (
    !css.includes('overflow-x: auto;') ||
    !css.includes('overflow-y: visible;')
) {
    fail('Table chỉ được scroll ngang mặc định.')
}
if (
    !layout.includes('admin-content-body') ||
    !header.includes('admin-header-left')
) {
    fail(
        'Layout class names phải bám source AXIRO cha để dùng chung CSS contract.',
    )
}
if (!css.includes('.admin-sider') || !css.includes('.admin-page-title')) {
    fail('Thiếu layout CSS aliases theo AXIRO cha.')
}

console.log(
    'Parent UI source alignment passed: actions, filters, table, layout and CSS contracts are source-derived.',
)
