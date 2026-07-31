import fs from 'node:fs'
import path from 'node:path'
const root = process.cwd()
const required = [
    'src/app/router/index.jsx',
    'src/configs/adminMenu.jsx',
    'src/constants/index.js',
    'src/middleware/RequireAuth.jsx',
    'src/middleware/GuestOnly.jsx',
    'src/hooks/index.js',
    'src/hooks/useBaseFilters.js',
    'src/hooks/useFormActionModal.js',
    'src/hooks/useModulePageData.js',
    'src/hooks/usePageHeaderActions.js',
    'src/hooks/useServiceOverview.js',
    'src/hooks/useStatistics.js',
    'src/hooks/useTimeline.js',
    'src/services/apiPaths.js',
    'src/services/endpoints.js',
]
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)))
if (missing.length) {
    console.error('Parent parallel structure missing:\n' + missing.join('\n'))
    process.exit(1)
}
const app = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8')
if (!app.includes('./app/router')) {
    console.error('App.jsx must delegate to app/router owner')
    process.exit(1)
}
console.log(
    `Parent parallel structure OK: ${required.length} canonical files present.`,
)
