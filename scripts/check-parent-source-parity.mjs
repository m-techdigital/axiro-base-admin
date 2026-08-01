import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(
    root,
    'docs/canonical/parent-base-provenance.json',
)
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const failures = []

for (const entry of manifest.entries) {
    const filePath = path.join(root, entry.mini_path)
    if (!fs.existsSync(filePath)) {
        failures.push(`Thiếu ${entry.mini_path}`)
        continue
    }
    if (entry.mode === 'exact_source') {
        const hash = crypto
            .createHash('sha256')
            .update(fs.readFileSync(filePath))
            .digest('hex')
        if (hash !== entry.sha256)
            failures.push(`${entry.mini_path} đã lệch source AXIRO cha`)
    }
}

const moduleCss = []
const walk = (dir) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, item.name)
        if (item.isDirectory()) walk(full)
        else if (/\.(css|scss)$/.test(item.name)) moduleCss.push(full)
    }
}
const modulesDir = path.join(root, 'src/modules')
if (fs.existsSync(modulesDir)) walk(modulesDir)
const forbidden =
    /\.(base-modal|base-form-footer|base-filter|base-table|base-page-header)\b/
for (const file of moduleCss) {
    if (forbidden.test(fs.readFileSync(file, 'utf8'))) {
        failures.push(`${path.relative(root, file)} ghi đè CSS base owner`)
    }
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log(
    'Parent source parity passed: exact copies, bounded adapters, and CSS ownership are explicit.',
)
