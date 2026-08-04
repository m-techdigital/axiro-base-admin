import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const manifest = JSON.parse(
    fs.readFileSync(
        path.join(root, 'docs/release/recovery-baseline.json'),
        'utf8',
    ),
)
const failures = []
for (const file of manifest.critical_files) {
    if (!fs.existsSync(path.join(root, file)))
        failures.push(`Thiếu recovery owner: ${file}`)
}
const hasFiles = (directory) => {
    if (!fs.existsSync(directory)) return false
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const child = path.join(directory, entry.name)
        if (entry.isFile()) return true
        if (entry.isDirectory() && hasFiles(child)) return true
    }
    return false
}
for (const forbidden of [
    'app',
    'bootstrap',
    'config',
    'database',
    'lang',
    'resources',
    'routes',
    'storage',
    'tests',
]) {
    const target = path.join(root, forbidden)
    if (hasFiles(target))
        failures.push(`Admin package bị lẫn backend source: ${forbidden}`)
}
const contract = fs.readFileSync(
    path.join(root, 'src/contracts/marketplace-contract.json'),
)
const { createHash } = await import('node:crypto')
const hash = createHash('sha256').update(contract).digest('hex')
if (hash !== manifest.contract_sha256)
    failures.push(`Contract hash lệch recovery baseline: ${hash}`)
if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log(
    'Recovery baseline guard passed: Admin capabilities and package boundaries are intact.',
)
