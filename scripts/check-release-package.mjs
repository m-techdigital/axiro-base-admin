import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const allowedEnvTemplates = new Set(['.env.example', '.env.production.example'])
const forbiddenSegments = new Set(['node_modules', 'vendor', 'dist', 'build'])
const failures = []
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')

const trackedFiles = () => {
    try {
        return execSync(`git -C ${JSON.stringify(root)} ls-files`, {
            encoding: 'utf8',
        })
            .trim()
            .split(/\r?\n/)
            .filter(Boolean)
    } catch {
        const files = []
        const walk = (directory) => {
            for (const entry of fs.readdirSync(directory, {
                withFileTypes: true,
            })) {
                if (entry.name === '.git') continue
                const absolute = path.join(directory, entry.name)
                const relative = path
                    .relative(root, absolute)
                    .replaceAll('\\', '/')
                if (entry.isDirectory()) walk(absolute)
                else files.push(relative)
            }
        }
        walk(root)
        return files
    }
}

for (const file of trackedFiles()) {
    const parts = file.split('/')
    if (parts.some((part) => forbiddenSegments.has(part))) {
        failures.push(
            `${file}: release package không được chứa dependency/build output.`,
        )
    }
    const basename = path.basename(file)
    if (basename.startsWith('.env') && !allowedEnvTemplates.has(basename)) {
        failures.push(
            `${file}: release package không được chứa file môi trường thật.`,
        )
    }
}

for (const required of ['package.json', 'src', 'docs/canonical']) {
    if (!fs.existsSync(path.join(root, required)))
        failures.push(`${required}: thiếu release root contract.`)
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}

console.log(
    'Release package guard passed: env, dependency output and root layout are clean.',
)
