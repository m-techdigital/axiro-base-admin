import fs from 'node:fs'

const checks = [
    ['src/modules/notifications/pages/List.jsx', 'action_context?.deep_link'],
    ['src/modules/notifications/pages/List.jsx', 'next_action?.label'],
    ['src/modules/payouts/pages/Index.jsx', 'journey?.next_action'],
    ['src/modules/payouts/pages/Index.jsx', 'customer_context'],
]

for (const [file, marker] of checks) {
    const source = fs.readFileSync(
        new URL(`../${file}`, import.meta.url),
        'utf8',
    )
    if (!source.includes(marker)) {
        throw new Error(`${file} thiếu marker bắt buộc: ${marker}`)
    }
}

console.log('notification/payout journey contract: PASS')
