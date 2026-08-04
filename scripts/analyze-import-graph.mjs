import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('src')
const focus = [
    'main.jsx',
    'App.jsx',
    'app/router/index.jsx',
    'components/base/BaseForm.jsx',
    'components/base/BaseTable.jsx',
    'components/base/BaseFilter.jsx',
    'components/base/BaseModal.jsx',
    'modules/transactions/pages/Detail.jsx',
    'modules/document-templates/pages/List.jsx',
    'pages/Dashboard.jsx',
]
const importPattern =
    /(?:import|export)\s+(?:[^'\"]+?\s+from\s+)?['\"]([^'\"]+)['\"]/g
const importsOf = (file) =>
    fs.existsSync(file)
        ? [...fs.readFileSync(file, 'utf8').matchAll(importPattern)].map(
              (match) => match[1],
          )
        : []

console.log('=== Admin import graph focus ===')
for (const relative of focus) {
    const imports = importsOf(path.join(root, relative))
    const antd = imports.filter(
        (value) =>
            value === 'antd' ||
            value.startsWith('antd/') ||
            value.startsWith('@ant-design/'),
    )
    console.log(`\n${relative}`)
    console.log(`  direct imports: ${imports.length}`)
    console.log(`  AntD imports: ${antd.length ? antd.join(', ') : 'none'}`)
}
const routeText = fs.readFileSync(
    path.join(root, 'routes/adminRoutes.jsx'),
    'utf8',
)
const lazyRoutes = [
    ...routeText.matchAll(/lazy\(\(\)\s*=>\s*import\(['\"]([^'\"]+)['\"]\)\)/g),
].map((match) => match[1])
console.log(`\nLazy route owners: ${lazyRoutes.length}`)
for (const route of lazyRoutes) console.log(`  ${route}`)
if (
    /return\s+['\"]antd-core['\"]/.test(
        fs.readFileSync('vite.config.js', 'utf8'),
    )
) {
    console.error(
        '\nFAIL: vite.config.js still forces a monolithic antd-core chunk.',
    )
    process.exit(1)
}
const bootstrapFiles = ['main.jsx', 'App.jsx', 'app/router/index.jsx']
const bootstrapRootAntd = bootstrapFiles.flatMap((relative) =>
    importsOf(path.join(root, relative))
        .filter((value) => value === 'antd')
        .map(() => relative),
)
if (bootstrapRootAntd.length) {
    console.error(
        `\nFAIL: bootstrap imports the AntD barrel: ${bootstrapRootAntd.join(', ')}`,
    )
    process.exit(1)
}
console.log(
    '\nPASS: AntD is not forced into one shared core chunk and bootstrap avoids the AntD barrel.',
)
