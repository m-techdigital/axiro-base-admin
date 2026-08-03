import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist/assets')
if (!fs.existsSync(dist)) {
    console.error('Chưa có dist/assets. Hãy chạy npm run build trước.')
    process.exit(2)
}
const rows = fs
    .readdirSync(dist)
    .filter((name) => /\.(js|css)$/.test(name))
    .map((name) => ({ name, bytes: fs.statSync(path.join(dist, name)).size }))
    .sort((a, b) => b.bytes - a.bytes)
const initialBudget =
    Number(process.env.ADMIN_BUNDLE_CHUNK_BUDGET_KB || 650) * 1024
for (const row of rows)
    console.log(`${(row.bytes / 1024).toFixed(1).padStart(8)} KB  ${row.name}`)
const oversized = rows.filter((row) => row.bytes > initialBudget)
if (oversized.length) {
    console.warn(
        `Cảnh báo: ${oversized.length} chunk vượt ${Math.round(initialBudget / 1024)} KB.`,
    )
    if (process.env.BUNDLE_BUDGET_STRICT === '1') process.exit(1)
}
