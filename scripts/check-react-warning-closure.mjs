import fs from 'node:fs'
import path from 'node:path'

const roots = ['src']
const files = []
const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (/\.(js|jsx)$/.test(entry.name)) files.push(full)
    }
}
roots.forEach(walk)

const violations = []
for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    if (/<Space\b[^>]*\bdirection=/.test(source)) {
        violations.push(`${file}: use Space orientation instead of direction`)
    }
    if (/<Alert\b[^>]*\bmessage=/.test(source)) {
        violations.push(`${file}: use Alert title instead of message`)
    }
    if (/rowKey\s*=\s*\{?\s*\(?[^\n)]*index/.test(source)) {
        violations.push(`${file}: rowKey must not depend on array index`)
    }
}
if (violations.length) {
    console.error(
        `React/AntD warning closure failed:\n- ${violations.join('\n- ')}`,
    )
    process.exit(1)
}
console.log('React/AntD warning closure passed.')
