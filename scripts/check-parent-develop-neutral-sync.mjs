import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(
    root,
    'docs/canonical/parent-develop-neutral-sync.json',
)
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const hash = (file) =>
    crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const failures = []
for (const item of manifest.exact_source) {
    const file = path.join(root, item.target)
    if (!fs.existsSync(file))
        failures.push(`missing exact source: ${item.target}`)
    else if (hash(file) !== item.sha256)
        failures.push(`exact source drift: ${item.target}`)
}
for (const item of manifest.mechanical_extract) {
    const file = path.join(root, item.target)
    if (!fs.existsSync(file))
        failures.push(`missing mechanical extract: ${item.target}`)
    else if (hash(file) !== item.sha256)
        failures.push(`mechanical extract drift: ${item.target}`)
}
const baseIndex = fs.readFileSync(
    path.join(root, 'src/components/base/index.js'),
    'utf8',
)
for (const name of [
    'BaseHeaderFilters',
    'BaseListInput',
    'BaseNumberFormatter',
    'BaseViewModeSwitch',
    'BaseWidgetGrid',
    'FieldContainer',
    'BaseCardStatistics',
    'BaseCheckbox',
]) {
    if (!baseIndex.includes(name)) failures.push(`missing base export: ${name}`)
}
const hookIndex = fs.readFileSync(
    path.join(root, 'src/hooks/table/index.js'),
    'utf8',
)
if (!hookIndex.includes('useTableSummary'))
    failures.push('missing useTableSummary export')
const cssEntry = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8')
if (!cssEntry.includes('parent-develop-neutral.css'))
    failures.push('missing parent neutral css import')
if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log('Parent develop neutral sync: PASS')
