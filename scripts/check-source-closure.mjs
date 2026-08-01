import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const srcRoot = path.join(root, 'src')
const packageJson = JSON.parse(
    fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
)
const declaredPackages = new Set([
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
])
const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs'])
const resolveExtensions = [
    '',
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.json',
    '.css',
    '.scss',
]
const importPattern =
    /(?:import|export)\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g
const failures = []

const walk = (directory) =>
    fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const absolute = path.join(directory, entry.name)
        if (entry.isDirectory()) return walk(absolute)
        return [absolute]
    })

const resolveLocal = (fromFile, specifier) => {
    const base = specifier.startsWith('@/')
        ? path.join(srcRoot, specifier.slice(2))
        : path.resolve(path.dirname(fromFile), specifier)

    for (const extension of resolveExtensions) {
        const candidate = `${base}${extension}`
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile())
            return candidate
    }

    if (fs.existsSync(base) && fs.statSync(base).isDirectory()) {
        for (const indexFile of [
            'index.js',
            'index.jsx',
            'index.ts',
            'index.tsx',
        ]) {
            const candidate = path.join(base, indexFile)
            if (fs.existsSync(candidate)) return candidate
        }
    }

    return null
}

for (const file of walk(srcRoot).filter((candidate) =>
    sourceExtensions.has(path.extname(candidate)),
)) {
    const source = fs.readFileSync(file, 'utf8')
    for (const match of source.matchAll(importPattern)) {
        const specifier = match[1] || match[2]
        if (!specifier) continue

        if (specifier.startsWith('.') || specifier.startsWith('@/')) {
            if (!resolveLocal(file, specifier)) {
                failures.push(
                    `${path.relative(root, file)}: unresolved local import ${specifier}`,
                )
            }
            continue
        }

        const packageName = specifier.startsWith('@')
            ? specifier.split('/').slice(0, 2).join('/')
            : specifier.split('/')[0]
        if (!declaredPackages.has(packageName)) {
            failures.push(
                `${path.relative(root, file)}: undeclared package import ${packageName}`,
            )
        }
    }
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}

console.log(
    'Source closure passed: all local imports resolve and all package imports are declared.',
)
