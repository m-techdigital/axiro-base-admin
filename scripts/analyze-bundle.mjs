import fs from 'node:fs'
import path from 'node:path'

const distRoot = path.resolve('dist')
const assetsRoot = path.join(distRoot, 'assets')
const manifestPath = path.join(distRoot, '.vite', 'manifest.json')
const reportPath = path.join(distRoot, 'bundle-report.json')

if (!fs.existsSync(assetsRoot)) {
    console.error('Chưa có dist/assets. Hãy chạy npm run build trước.')
    process.exit(2)
}

const bytesOf = (relative) => {
    const file = path.join(distRoot, relative)
    return fs.existsSync(file) ? fs.statSync(file).size : 0
}
const kb = (bytes) => Number((bytes / 1024).toFixed(1))
const assetRows = fs
    .readdirSync(assetsRoot)
    .filter((name) => /\.(js|css)$/.test(name))
    .map((name) => ({
        name,
        bytes: fs.statSync(path.join(assetsRoot, name)).size,
    }))
    .sort((a, b) => b.bytes - a.bytes)

for (const row of assetRows) {
    console.log(`${kb(row.bytes).toFixed(1).padStart(8)} KB  ${row.name}`)
}

const chunkBudget =
    Number(process.env.ADMIN_BUNDLE_CHUNK_BUDGET_KB || 650) * 1024
const initialBudget =
    Number(process.env.ADMIN_INITIAL_JS_BUDGET_KB || 650) * 1024
const routeBudget = Number(process.env.ADMIN_ROUTE_JS_BUDGET_KB || 650) * 1024
const oversized = assetRows.filter((row) => row.bytes > chunkBudget)
if (oversized.length) {
    console.warn(
        `Cảnh báo: ${oversized.length} asset vượt ${Math.round(chunkBudget / 1024)} KB.`,
    )
}

const report = {
    generated_at: new Date().toISOString(),
    budgets_kb: {
        chunk: kb(chunkBudget),
        initial_js: kb(initialBudget),
        route_js: kb(routeBudget),
    },
    assets: assetRows.map((row) => ({ ...row, kb: kb(row.bytes) })),
    initial: null,
    routes: [],
    violations: [],
}

if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    const closure = (rootKey) => {
        const visited = new Set()
        const files = new Set()
        const css = new Set()
        const visit = (key) => {
            if (!key || visited.has(key) || !manifest[key]) return
            visited.add(key)
            const item = manifest[key]
            if (item.file) files.add(item.file)
            for (const value of item.css || []) css.add(value)
            for (const dependency of item.imports || []) visit(dependency)
        }
        visit(rootKey)
        return {
            js_files: [...files],
            css_files: [...css],
            js_bytes: [...files].reduce((sum, file) => sum + bytesOf(file), 0),
            css_bytes: [...css].reduce((sum, file) => sum + bytesOf(file), 0),
        }
    }

    const entries = Object.entries(manifest).filter(([, item]) => item.isEntry)
    const initialFiles = new Set()
    const initialCss = new Set()
    for (const [key] of entries) {
        const value = closure(key)
        value.js_files.forEach((file) => initialFiles.add(file))
        value.css_files.forEach((file) => initialCss.add(file))
    }
    const initialJs = [...initialFiles].reduce(
        (sum, file) => sum + bytesOf(file),
        0,
    )
    const initialCssBytes = [...initialCss].reduce(
        (sum, file) => sum + bytesOf(file),
        0,
    )
    report.initial = {
        js_kb: kb(initialJs),
        css_kb: kb(initialCssBytes),
        js_files: [...initialFiles],
        css_files: [...initialCss],
    }
    console.log(
        `\nInitial entry closure: ${kb(initialJs).toFixed(1)} KB JS + ${kb(initialCssBytes).toFixed(1)} KB CSS`,
    )
    console.log(
        `Initial files: ${[...initialFiles, ...initialCss].join(', ') || 'none'}`,
    )

    const routeRows = Object.entries(manifest)
        .filter(([, item]) => item.isDynamicEntry)
        .map(([key, item]) => {
            const value = closure(key)
            return {
                source: item.src || key,
                file: item.file,
                js_kb: kb(value.js_bytes),
                css_kb: kb(value.css_bytes),
                js_files: value.js_files,
                css_files: value.css_files,
            }
        })
        .sort((a, b) => b.js_kb - a.js_kb)
    report.routes = routeRows
    if (routeRows.length) {
        console.log('\nLargest lazy route closures:')
        for (const route of routeRows.slice(0, 12)) {
            console.log(
                `${route.js_kb.toFixed(1).padStart(8)} KB JS + ${route.css_kb.toFixed(1).padStart(6)} KB CSS  ${route.source}`,
            )
        }
    }

    if (initialJs > initialBudget) {
        report.violations.push({
            type: 'initial_js',
            actual_kb: kb(initialJs),
            budget_kb: kb(initialBudget),
        })
        console.warn(
            `Cảnh báo initial JS vượt ${Math.round(initialBudget / 1024)} KB.`,
        )
    }
    for (const route of routeRows.filter(
        (item) => item.js_kb * 1024 > routeBudget,
    )) {
        report.violations.push({
            type: 'route_js',
            source: route.source,
            actual_kb: route.js_kb,
            budget_kb: kb(routeBudget),
        })
    }
} else {
    console.warn(
        'Thiếu dist/.vite/manifest.json; không đo được initial/route import closure.',
    )
    report.violations.push({ type: 'missing_manifest' })
}

for (const row of oversized) {
    report.violations.push({
        type: 'asset',
        name: row.name,
        actual_kb: kb(row.bytes),
        budget_kb: kb(chunkBudget),
    })
}
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(`\nBundle report: ${reportPath}`)

if (process.env.BUNDLE_BUDGET_STRICT === '1' && report.violations.length) {
    console.error(
        `Bundle budget strict mode failed with ${report.violations.length} violation(s).`,
    )
    process.exit(1)
}
