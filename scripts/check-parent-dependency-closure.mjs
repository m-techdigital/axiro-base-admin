import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(
    fs.readFileSync(
        path.join(root, 'docs/canonical/parent-base-provenance.json'),
        'utf8',
    ),
)
const failures = []
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')
const readAdminFoundation = () =>
    [
        'src/styles/primitives/admin-foundation.scss',
        ...fs
            .readdirSync(
                path.join(root, 'src/styles/primitives/admin-foundation'),
            )
            .filter((file) => file.endsWith('.scss'))
            .sort()
            .map((file) => `src/styles/primitives/admin-foundation/${file}`),
    ]
        .map(read)
        .join('\n')
const hash = (relativePath) =>
    crypto
        .createHash('sha256')
        .update(fs.readFileSync(path.join(root, relativePath)))
        .digest('hex')

for (const entry of manifest.entries) {
    if (!entry.sha256) continue
    if (!fs.existsSync(path.join(root, entry.mini_path))) {
        failures.push(`Thiếu ${entry.mini_path}`)
        continue
    }
    if (hash(entry.mini_path) !== entry.sha256) {
        failures.push(`${entry.mini_path} lệch provenance đã duyệt`)
    }
}

const parentModal = read('src/components/base/ParentBaseModal.jsx')
if (/base-modal\.scss/.test(parentModal)) {
    failures.push('ParentBaseModal còn phụ thuộc SCSS ngoài toolchain Mini')
}
if (
    !/className={`base-modal/.test(parentModal) ||
    !/base-modal-body/.test(parentModal)
) {
    failures.push('ParentBaseModal không giữ class contract của AXIRO cha')
}

const formModal = read('src/components/base/BaseFormModal.jsx')
if (!/BaseModalForm/.test(formModal)) {
    failures.push(
        'BaseFormModal chưa delegate modal shell cho BaseModalForm nguồn cha',
    )
}
if (
    !/record/.test(formModal) ||
    !/tabs/.test(formModal) ||
    !/onFinish/.test(formModal)
) {
    failures.push(
        'BaseFormModal thiếu contract record/tabs/onFinish của AXIRO cha',
    )
}

const pageHeaderHook = read('src/hooks/usePageHeaderActions.js')
if (
    !/resolvePageHeaderConfig/.test(pageHeaderHook) ||
    !/formContext/.test(pageHeaderHook)
) {
    failures.push('usePageHeaderActions chưa giữ lifecycle/context nguồn cha')
}

const foundationCss = readAdminFoundation()
for (const owner of ['.base-modal ', '.base-modal\n', '.base-form-footer {']) {
    if (foundationCss.includes(owner)) {
        failures.push(
            `admin-foundation.scss còn cạnh tranh owner ${owner.trim()}`,
        )
    }
}
const modalCss = read('src/styles/primitives/parent-base-modal.css')
if (!modalCss.includes('.base-modal-body')) {
    failures.push('parent-base-modal.css thiếu body selector đúng runtime')
}
const modalFormCss = read(
    'src/components/base/BaseModalForm/base-modal-form.css',
)
if (!modalFormCss.includes('.base-modal-form-footer')) {
    failures.push('BaseModalForm thiếu footer CSS source-derived')
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}

console.log(
    'Parent dependency closure passed: source copies, adapters, imports and CSS owners are dependency-closed.',
)
