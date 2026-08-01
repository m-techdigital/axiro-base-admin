import fs from 'node:fs'
const read = (p) => fs.readFileSync(p, 'utf8')
const checks = [
    [
        'entityLabel consumed',
        read('src/components/base/BaseDeleteButton.jsx').includes(
            "entityLabel = 'bản ghi'",
        ),
    ],
    [
        'drawer size adapter',
        read('src/components/base/BaseDrawer.jsx').includes(
            'normalizeDrawerSize',
        ),
    ],
    [
        'modal forceRender',
        read('src/components/base/ParentBaseModal.jsx').includes('forceRender'),
    ],
    [
        'filter no Input.Search',
        !read('src/components/base/BaseFilter.jsx').includes(
            'search: Input.Search',
        ),
    ],
    [
        'table stable row key',
        read('src/components/base/BaseTable.jsx').includes('resolvedRowKey'),
    ],
    [
        'relation select no form prop forwarding',
        !read('src/components/base/RelationSelect.jsx').includes('form={form}'),
    ],
]
for (const [name, ok] of checks) {
    if (!ok) throw new Error(name)
}
console.log('Base runtime/field closure checks passed')
