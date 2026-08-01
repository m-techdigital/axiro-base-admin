import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const modulesRoot = path.join(root, 'src/modules')
const failures = []
const enumLeakPattern =
    /\.map\(\s*\(?\s*(?:value|status|x|v)\s*\)?\s*=>\s*\(\{\s*value\s*[:,]\s*(?:value|status|x|v)\s*,\s*label\s*:\s*(?:value|status|x|v)/s

const walk = (directory) =>
    fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const absolute = path.join(directory, entry.name)
        if (entry.isDirectory()) return walk(absolute)
        return [absolute]
    })

for (const file of walk(modulesRoot).filter((candidate) =>
    /\.(jsx?|tsx?)$/.test(candidate),
)) {
    const source = fs.readFileSync(file, 'utf8')
    const relative = path.relative(root, file)

    if (/<Button\b/.test(source) || /<\/Button>/.test(source)) {
        failures.push(
            `${relative}: imports or renders raw Ant Design Button instead of BaseButton/BaseFormFooter`,
        )
    }

    if (enumLeakPattern.test(source)) {
        failures.push(`${relative}: exposes raw enum values as option labels`)
    }

    if (
        /title:\s*['"]Thao tác['"][\s\S]{0,800}?render:[\s\S]{0,800}?<button\b/i.test(
            source,
        )
    ) {
        failures.push(`${relative}: action column renders a raw DOM button`)
    }
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}

console.log(
    'Base consumer adoption passed: module buttons and enum options use shared owners.',
)
