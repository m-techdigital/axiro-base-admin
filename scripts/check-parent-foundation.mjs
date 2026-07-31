import fs from 'node:fs'
const required = [
    'src/layouts/AdminLayout.jsx',
    'src/layouts/components/AdminHeader.jsx',
    'src/layouts/components/AdminSidebar.jsx',
    'src/components/base/BasePageHeader.jsx',
    'src/components/base/BaseTable.jsx',
    'src/components/base/BaseModal.jsx',
    'src/components/base/BaseDrawer.jsx',
    'src/components/base/BaseForm.jsx',
    'src/components/base/BaseListView.jsx',
    'src/components/base/index.js',
    'src/config/adminMenu.jsx',
    'src/styles/tokens/admin-tokens.css',
    'src/styles/primitives/admin-foundation.css',
    'docs/canonical/README.md',
    'docs/adr/0001-parent-aligned-foundation.md',
]
const missing = required.filter((file) => !fs.existsSync(file))
if (missing.length) {
    console.error('Thiếu foundation AXIRO cha:\n' + missing.join('\n'))
    process.exit(1)
}
const layout = fs.readFileSync('src/layouts/AdminLayout.jsx', 'utf8')
if (
    !layout.includes('AdminSidebar') ||
    !layout.includes('AdminHeader') ||
    !layout.includes('admin-content__body')
)
    process.exit(1)
const base = fs.readFileSync('src/components/base/index.js', 'utf8')
for (const name of [
    'BasePageHeader',
    'BaseTable',
    'BaseModal',
    'BaseDrawer',
    'BaseForm',
    'BaseListView',
])
    if (!base.includes(name)) process.exit(1)
console.log('Parent foundation contract passed.')
