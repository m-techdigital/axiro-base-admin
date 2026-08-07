import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const readAdminFoundation = () =>
    [
        'src/styles/primitives/admin-foundation.scss',
        ...fs
            .readdirSync(
                path.join(root, 'src/styles/primitives/admin-foundation'),
            )
            .filter((file) => file.endsWith('.scss'))
            .sort()
            .map((file) => `src/styles/primitives/admin-foundation/${file}`),
    ]
        .map(read)
        .join('\n')
const expect = (condition, message) => {
    if (!condition) throw new Error(message)
}

const modal = read('src/components/base/ParentBaseModal.jsx')
const filter = read('src/components/base/BaseFilter.jsx')
const filterControl = read('src/components/base/BaseFilterControl.jsx')
const form = read('src/components/base/BaseForm.jsx')
const formControl = read('src/components/base/BaseFormControl.jsx')
const formModal = read('src/components/base/BaseFormModal.jsx')
const formChange = read('src/components/base/BaseForm/formChange.js')
const formComputed = read('src/components/base/BaseForm/formComputed.js')
const formErrors = read('src/components/base/BaseForm/formErrors.js')
const formSubmit = read('src/components/base/BaseForm/formSubmit.js')
const formUtils = read('src/components/base/BaseForm/formUtils.js')
const relationSelect = read('src/components/base/RelationSelect.jsx')
const relationOptions = [
    read('src/hooks/useRelationOptions.jsx'),
    read('src/hooks/relation/relationConfigResolver.js'),
    read('src/hooks/relation/relationOptionCache.js'),
    read('src/hooks/relation/relationOptionNormalizer.js'),
].join('\n')
const extractRelationConfigs = read('src/utils/extractRelationConfigs.js')
const header = read('src/components/base/BasePageHeader.jsx')
const list = read('src/components/base/BaseListView.jsx')
const table = read('src/components/base/BaseTable.jsx')
const exportsFile = read('src/components/base/index.js')
const css = readAdminFoundation()
const modalCss = read('src/styles/primitives/parent-base-modal.css')

expect(
    modal.includes('maskClosable') && modal.includes('onCancel={onCancel}'),
    'ParentBaseModal phải sở hữu close/mask policy',
)
expect(
    filter.includes('filters = []') && filterControl.includes('dateRange'),
    'BaseFilter phải hỗ trợ group và date range',
)
expect(filter.includes('onValuesChange'), 'BaseFilter phải có change contract')
expect(
    form.includes('mapLaravelErrorsToFields') &&
        form.includes('getLaravelValidationError'),
    'BaseForm phải sở hữu mapping lỗi backend theo AXIRO cha',
)
expect(
    form.includes('buildSubmitPayload') &&
        form.includes('useComputedFields') &&
        form.includes('extractRelationConfigs') &&
        form.includes('useRelationOptions') &&
        form.includes('createRenderField') &&
        !form.includes('BaseFormControl') &&
        form.includes('buildDependentResetFields') &&
        form.includes('tabs') &&
        form.includes('sections') &&
        form.includes('runFormSubmitIfAllowed'),
    'BaseForm phải là bounded adapter theo lifecycle cha, không chỉ là Ant Form wrapper',
)
expect(
    formModal.includes('fields={fields}') &&
        formModal.includes('tabs={tabs}') &&
        formModal.includes('sections={sections}') &&
        !formModal.includes('BaseForm.Item') &&
        !formModal.includes('CONTROL_BY_TYPE'),
    'BaseFormModal phải delegate schema cho BaseForm, không tự render control riêng',
)
expect(
    formChange.includes('runFieldChangeHandlers') &&
        formChange.includes('relationConfigs') &&
        formComputed.includes('useComputedFields') &&
        formErrors.includes('buildFormErrorMessages') &&
        formSubmit.includes('buildSubmitPayload') &&
        formUtils.includes('normalizeGroups'),
    'BaseForm thiếu helper owner change/computed/errors/submit/utils theo AXIRO cha',
)
expect(
    relationSelect.includes('optionFilterProp="label"') &&
        relationSelect.includes('loadOptions') &&
        relationSelect.includes('onOpenChange'),
    'RelationSelect phải giữ dynamic relation loader/filter contract của AXIRO cha',
)
expect(
    relationOptions.includes('getModuleAction') &&
        relationOptions.includes('runCascade') &&
        relationOptions.includes('sharedInflight') &&
        relationOptions.includes('fallbackOptions'),
    'useRelationOptions phải giữ cache/cascade/hydrate relation contract của AXIRO cha',
)
expect(
    extractRelationConfigs.includes("['relation', 'select_badge']") &&
        extractRelationConfigs.includes('dynamic-form-list'),
    'extractRelationConfigs phải nhận diện relation và dynamic-form-list như AXIRO cha',
)
expect(
    header.includes('BaseBreadcrumb') &&
        header.includes('usePageHeaderActions'),
    'BasePageHeader phải sở hữu breadcrumb/action runtime',
)
expect(
    header.includes('BaseFormModal'),
    'BasePageHeader phải hỗ trợ action form canonical',
)
expect(
    list.includes('statistics') && list.includes('BaseAsyncState'),
    'BaseListView phải sở hữu statistics/async state',
)
expect(
    table.includes('meta') && table.includes('onPaginationChange'),
    'BaseTable phải chuẩn hóa pagination meta',
)
expect(
    exportsFile.includes('BaseBreadcrumb') &&
        exportsFile.includes('BaseFormModal'),
    'Base exports thiếu owner canonical',
)
expect(
    css.includes('.base-breadcrumb') &&
        modalCss.includes('--base-modal-body-max-height'),
    'CSS base parity chưa đầy đủ',
)

console.log('Parent base parity contract passed.')
