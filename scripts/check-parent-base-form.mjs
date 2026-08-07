import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const requireToken = (source, token, label) => {
    if (!source.includes(token))
        throw new Error(`BaseForm parent parity missing: ${label}`)
}

const baseForm = read('src/components/base/BaseForm.jsx')
const registry = read('src/utils/fields/fieldRegistry.jsx')
const container = read('src/components/base/FieldContainer.jsx')
const modal = read('src/components/base/BaseFormModal.jsx')
const footer = read('src/components/base/BaseFormFooter.jsx')

requireToken(baseForm, 'createRenderField', 'parent field registry owner')
requireToken(
    baseForm,
    'mapLaravelErrorsToFields',
    'Laravel field error mapping',
)
requireToken(baseForm, 'focusFirstError', 'focus/scroll first invalid field')
requireToken(baseForm, 'runFormSubmitIfAllowed', 'single-flight submit policy')
requireToken(baseForm, 'AntForm.useWatch([], form)', 'controlled form watch')
requireToken(registry, 'FieldContainer', 'parent FieldContainer owner')
requireToken(registry, 'FIELD_ADAPTERS', 'parent adapter registry')
requireToken(
    container,
    'formItemProps',
    'Form.Item controlled transform support',
)
requireToken(
    modal,
    'if (onCancel?.() === false) return false',
    'cancel veto contract',
)
requireToken(footer, 'submitDisabled', 'submit disabled contract')

if (baseForm.includes('BaseFormControl')) {
    throw new Error(
        'BaseForm must not use the Mini-only BaseFormControl renderer',
    )
}

console.log('Parent BaseForm parity guard passed.')
