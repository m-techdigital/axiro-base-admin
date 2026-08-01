import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const expect = (condition, message) => {
    if (!condition) throw new Error(message)
}

const modal = read('src/components/base/ParentBaseModal.jsx')
const filter = read('src/components/base/BaseFilter.jsx')
const form = read('src/components/base/BaseForm.jsx')
const header = read('src/components/base/BasePageHeader.jsx')
const list = read('src/components/base/BaseListView.jsx')
const table = read('src/components/base/BaseTable.jsx')
const exportsFile = read('src/components/base/index.js')
const css = read('src/styles/primitives/admin-foundation.css')
const modalCss = read('src/styles/primitives/parent-base-modal.css')

expect(
    modal.includes('maskClosable') && modal.includes('onCancel={onCancel}'),
    'ParentBaseModal phải sở hữu close/mask policy',
)
expect(
    filter.includes('filters = []') && filter.includes('dateRange'),
    'BaseFilter phải hỗ trợ group và date range',
)
expect(filter.includes('onValuesChange'), 'BaseFilter phải có change contract')
expect(
    form.includes('normalizeServerErrors'),
    'BaseForm phải sở hữu mapping lỗi backend',
)
expect(
    header.includes('BaseBreadcrumb') &&
        header.includes('usePageHeaderActions'),
    'BasePageHeader phải sở hữu breadcrumb/action runtime',
)
expect(
    header.includes('BaseFormModal'),
    'BasePageHeader phải hỗ trợ action form canonical',
)
expect(
    list.includes('statistics') && list.includes('BaseAsyncState'),
    'BaseListView phải sở hữu statistics/async state',
)
expect(
    table.includes('meta') && table.includes('onPaginationChange'),
    'BaseTable phải chuẩn hóa pagination meta',
)
expect(
    exportsFile.includes('BaseBreadcrumb') &&
        exportsFile.includes('BaseFormModal'),
    'Base exports thiếu owner canonical',
)
expect(
    css.includes('.base-breadcrumb') &&
        modalCss.includes('--base-modal-body-max-height'),
    'CSS base parity chưa đầy đủ',
)

console.log('Parent base parity contract passed.')
