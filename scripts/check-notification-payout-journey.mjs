import fs from 'node:fs'

const readOwners = (files) =>
    files
        .map((file) =>
            fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'),
        )
        .join('\n')

const checks = [
    [[
        'src/modules/notifications/pages/List.jsx',
        'src/modules/notifications/components/NotificationDetailDrawer.jsx',
    ], 'action_context?.deep_link'],
    [[
        'src/modules/notifications/pages/List.jsx',
        'src/modules/notifications/components/NotificationDetailDrawer.jsx',
    ], 'next_action?.label'],
    [
        [
            'src/modules/payouts/pages/Index.jsx',
            'src/modules/payouts/components/payoutColumns.jsx',
            'src/modules/payouts/components/PayoutDecisionModal.jsx',
        ],
        'journey?.next_action',
    ],
    [
        [
            'src/modules/payouts/pages/Index.jsx',
            'src/modules/payouts/components/PayoutDecisionModal.jsx',
        ],
        'customer_context',
    ],
]

for (const [files, marker] of checks) {
    const source = readOwners(files)
    if (!source.includes(marker)) {
        throw new Error(`${files.join('|')} thiếu marker bắt buộc: ${marker}`)
    }
}

console.log('notification/payout journey contract: PASS')
