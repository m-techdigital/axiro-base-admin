import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const rendererDir = path.join(root, 'src/components/base/renderers')
const indexPath = path.join(rendererDir, 'index.js')
const failures = []

if (!fs.existsSync(indexPath)) {
    failures.push('Thiếu src/components/base/renderers/index.js')
} else {
    const source = fs.readFileSync(indexPath, 'utf8')
    const exportPattern = /from\s+['"](\.\/[^'"]+)['"]/g
    let match

    while ((match = exportPattern.exec(source))) {
        const specifier = match[1]
        const absolute = path.resolve(rendererDir, specifier)
        const candidates = [
            absolute,
            `${absolute}.js`,
            `${absolute}.jsx`,
            `${absolute}.mjs`,
            `${absolute}.cjs`,
            path.join(absolute, 'index.js'),
            path.join(absolute, 'index.jsx'),
        ]

        if (!candidates.some((candidate) => fs.existsSync(candidate))) {
            failures.push(`Renderer export không resolve được: ${specifier}`)
        }
    }
}

for (const required of [
    'users.jsx',
    'option.jsx',
    'code.jsx',
    'identity.jsx',
    'statistics.jsx',
]) {
    if (!fs.existsSync(path.join(rendererDir, required))) {
        failures.push(`Thiếu renderer nguồn AXIRO cha: ${required}`)
    }
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}

console.log(
    'Renderer closure passed: every barrel export resolves to a shipped renderer file.',
)
