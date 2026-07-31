import fs from 'node:fs'
import path from 'node:path'
const roots = ['src/modules', 'src/pages']
const forbidden = ['Table', 'Modal', 'Drawer', 'Form']
const failures = []
function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(file)
        else if (/\.(jsx|js)$/.test(entry.name)) {
            const src = fs.readFileSync(file, 'utf8')
            const match = src.match(
                /import\s*\{([^}]*)\}\s*from\s*['"]antd['"]/s,
            )
            if (match) {
                const names = match[1].split(',').map((v) => v.trim())
                for (const name of forbidden)
                    if (names.includes(name))
                        failures.push(`${file}: imports Ant ${name} directly`)
            }
        }
    }
}
for (const root of roots) if (fs.existsSync(root)) walk(root)
if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log('Base ownership contract passed.')
