import fs from 'node:fs'

const required = [
    'src/hooks/table/useTableAction.jsx',
    'src/hooks/useConfirmActionRunner.js',
    'src/utils/apiAdapter.js',
    'src/utils/params.js',
    'src/utils/notification.js',
    'src/services/axios.js',
    'src/components/base/BaseForm/formChange.js',
    'src/components/base/BaseForm/formComputed.js',
    'src/components/base/BaseForm/formErrors.js',
    'src/components/base/BaseForm/formSubmit.js',
    'src/components/base/BaseForm/formUtils.js',
]

for (const file of required) {
    if (!fs.existsSync(file)) {
        throw new Error(`Missing parent-compatible foundation owner: ${file}`)
    }
}

const axiosSource = fs.readFileSync('src/services/axios.js', 'utf8')
for (const marker of [
    'X-Request-ID',
    'X-Correlation-ID',
    'normalizeApiError',
]) {
    if (!axiosSource.includes(marker)) {
        throw new Error(`Axios foundation missing ${marker}`)
    }
}

const listSource = fs.readFileSync('src/hooks/useList.js', 'utf8')
for (const marker of ['AbortController', 'requestRef', 'getPaginationMeta']) {
    if (!listSource.includes(marker)) {
        throw new Error(`useList missing ${marker}`)
    }
}

const filterSource = fs.readFileSync('src/hooks/useBaseFilters.js', 'utf8')
for (const marker of [
    'useSearchParams',
    'normalizePaginationParams',
    'paginate',
]) {
    if (!filterSource.includes(marker)) {
        throw new Error(`useBaseFilters missing ${marker}`)
    }
}

const baseFormSource = fs.readFileSync(
    'src/components/base/BaseForm.jsx',
    'utf8',
)
for (const marker of [
    'mapLaravelErrorsToFields',
    'buildSubmitPayload',
    'useComputedFields',
    'normalizeGroups',
    'focusFirstError',
]) {
    if (!baseFormSource.includes(marker)) {
        throw new Error(`BaseForm bounded foundation missing ${marker}`)
    }
}

console.log('Parent deep foundation contract passed.')
