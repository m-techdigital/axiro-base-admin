import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const failures = []
const resolver = await import(
    pathToFileURL(
        path.join(root, 'src/hooks/relation/relationConfigResolver.js'),
    ).href
)

if (JSON.stringify(resolver.normalizeRelationParams(null)) !== '{}') {
    failures.push(
        'relationConfigResolver: null params must normalize to an empty object.',
    )
}
if (resolver.normalizeRelationParams('x').value !== 'x') {
    failures.push(
        'relationConfigResolver: scalar params must normalize to { value }.',
    )
}
if (!resolver.areRelationDependenciesReady({ customer_id: 1 })) {
    failures.push(
        'relationConfigResolver: populated dependencies must be ready.',
    )
}
if (resolver.areRelationDependenciesReady({ customer_id: '' })) {
    failures.push(
        'relationConfigResolver: empty required dependency must not be ready.',
    )
}
if (!resolver.shallowEqualRelationParams({ a: 1 }, { a: 1 })) {
    failures.push(
        'relationConfigResolver: equal param objects must compare equal.',
    )
}

const hook = fs.readFileSync(
    path.join(root, 'src/hooks/useRelationOptions.jsx'),
    'utf8',
)
if (hook.split(/\r?\n/).length > 520) {
    failures.push(
        'src/hooks/useRelationOptions.jsx: hook orchestration must remain below 520 lines.',
    )
}
for (const owner of [
    './relation/relationConfigResolver',
    './relation/relationOptionCache',
    './relation/relationOptionNormalizer',
]) {
    if (!hook.includes(owner))
        failures.push(`useRelationOptions: missing owner ${owner}.`)
}
if (/useLegacyRelationOptions|configsOrService\s*\.\s*list/.test(hook)) {
    failures.push(
        'useRelationOptions: legacy relation owner must not be restored.',
    )
}

const detail = fs.readFileSync(
    path.join(root, 'src/modules/transactions/pages/Detail.jsx'),
    'utf8',
)
if (detail.split(/\r?\n/).length > 150) {
    failures.push(
        'transactions/pages/Detail.jsx: route orchestration must remain below 150 lines.',
    )
}
if (!detail.includes('TransactionDetailSections')) {
    failures.push(
        'transactions/pages/Detail.jsx: presentation sections owner is missing.',
    )
}

if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
}
console.log(
    'Semantic owner guard passed: relation resolver and transaction detail owners are stable.',
)
