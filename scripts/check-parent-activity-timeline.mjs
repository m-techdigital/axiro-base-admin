import fs from 'node:fs'

const required = [
    'src/components/base/BaseTimeline.jsx',
    'src/components/timeline/TimelineChangeItem.jsx',
    'src/hooks/useTimeline.js',
    'src/utils/timeline.js',
    'src/modules/escrow-boxes/timeline.js',
    'src/modules/escrow-boxes/components/EscrowBoxHistoryTimeline.jsx',
]
for (const file of required) {
    if (!fs.existsSync(file))
        throw new Error(`Missing parent timeline owner: ${file}`)
}

const adapter = fs.readFileSync(
    'src/modules/escrow-boxes/components/EscrowBoxHistoryTimeline.jsx',
    'utf8',
)
if (
    !adapter.includes('<BaseTimeline') ||
    !adapter.includes('timelineSchema={escrowBoxTimelineSchema}')
) {
    throw new Error('Escrow Box history must be a thin BaseTimeline adapter')
}

const detail = fs.readFileSync(
    'src/modules/escrow-boxes/pages/Detail.jsx',
    'utf8',
)
if (!detail.includes('boxId={id}') || detail.includes('agreementHistory=')) {
    throw new Error(
        'Escrow Box detail must use timeline endpoint, not local table/timeline duplication',
    )
}

const hook = fs.readFileSync('src/hooks/useTimeline.js', 'utf8')
for (const parentSourceToken of [
    'const normalize = (res)',
    'const meta = (res) => res?.meta?.pagination',
    'limit: perPage',
    'meta: responseMeta',
]) {
    if (!hook.includes(parentSourceToken)) {
        throw new Error(
            `useTimeline must retain exact parent source behavior: ${parentSourceToken}`,
        )
    }
}

const service = fs.readFileSync('src/modules/escrow-boxes/service.js', 'utf8')
if (!service.includes('GET') && !service.includes('getTimeline')) {
    throw new Error(
        'Escrow Box Admin service must expose the timeline endpoint',
    )
}

const contract = JSON.parse(
    fs.readFileSync('src/contracts/marketplace-contract.json', 'utf8'),
)
if (
    !contract.admin_endpoints?.includes(
        'GET /escrow-boxes/{escrowBox}/timeline',
    )
) {
    throw new Error(
        'Admin marketplace contract must declare the Escrow Box timeline endpoint',
    )
}

console.log('Parent activity timeline alignment: PASS')
