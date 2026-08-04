import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const next = `${dir}/${entry.name}`

        if (entry.isDirectory()) {
            return walk(next)
        }

        return next
    })
const fail = (message) => {
    throw new Error(message)
}

const baseForm = read('src/components/base/BaseForm.jsx')
const baseFilter = read('src/components/base/BaseFilter.jsx')
const productList = read('src/modules/products/pages/List.jsx')
const paymentList = read('src/modules/payments/pages/List.jsx')
const depositList = read('src/modules/wallet-deposits/pages/List.jsx')
const disputeList = read('src/modules/disputes/pages/List.jsx')
const auditList = read('src/modules/audit-logs/pages/List.jsx')
const styles = read('src/index.css')

if (
    !baseForm.includes('resolveGridSpan') ||
    !baseForm.includes('gridColumn: `span ${gridSpan}`')
) {
    fail(
        'BaseForm phải sở hữu semantic grid span thật thay vì width calc làm vỡ form.',
    )
}
if (!baseForm.includes('if (legacySpan >= 4) return 4')) {
    fail('BaseForm phải bảo đảm field span 4 không bị bóp xuống cột quá hẹp.')
}
if (baseForm.includes('calc(${(span / 24) * 100}%')) {
    fail('BaseForm không được quay lại width calc trong CSS grid.')
}
if (
    !baseFilter.includes('autoSearch = true') ||
    !baseFilter.includes('onSearch(normalized)')
) {
    fail('BaseFilter phải tự tìm khi filter thay đổi.')
}
if (
    !baseFilter.includes('base-filter-field-col') ||
    baseFilter.includes('<Row')
) {
    fail(
        'BaseFilter phải dùng responsive grid chung, không dùng Row/Col fixed gây bóp filter.',
    )
}
if (
    productList.includes('window.prompt') ||
    !productList.includes('BaseReviewActionModal')
) {
    fail(
        'Duyệt/từ chối sản phẩm phải dùng modal chung, không dùng browser prompt.',
    )
}
if (
    !paymentList.includes('BaseReviewActionModal') ||
    paymentList.includes('Thông tin thanh toán chưa hợp lệ.')
) {
    fail('Đối soát thanh toán phải có modal và lý do từ chối nhập thật.')
}
if (!depositList.includes('BaseReviewActionModal')) {
    fail('Đối soát nạp tiền phải dùng modal review chung.')
}
if (
    !disputeList.includes('BaseForm') ||
    !disputeList.includes('BaseConfirmActionButton')
) {
    fail('Xử lý tranh chấp phải dùng BaseForm và confirm action.')
}
if (!auditList.includes('BaseListView') || !auditList.includes('valueLabel')) {
    fail('Nhật ký hệ thống phải dùng base page/list và mapping label.')
}
if (
    auditList.includes('const typeLabels') ||
    auditList.includes("fixed: 'right'")
) {
    fail(
        'Nhật ký hệ thống phải dùng label contract chung và không fixed action column gây lệch table.',
    )
}
if (!styles.includes('.base-statistics-grid')) {
    fail('Statistics dashboard phải có responsive grid owner.')
}

const invalidUseListConsumers = walk('src')
    .filter((file) => /\.(jsx?|tsx?)$/.test(file))
    .filter((file) => /useList\([^)]*\.list/.test(read(file)))

if (invalidUseListConsumers.length > 0) {
    fail(
        `useList phải nhận service object, không truyền service.list: ${invalidUseListConsumers.join(', ')}`,
    )
}

console.log('Admin UI runtime closure passed.')
