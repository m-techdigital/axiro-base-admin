import FieldContainer from '@/components/base/FieldContainer'
import {
    getIcon,
    normalizeOptions,
    getRelationKey,
} from './adapters/fieldAdapterContext'
import { basicFieldsAdapter } from './adapters/basicFields'
import { choiceFieldsAdapter } from './adapters/choiceFields'
import { temporalFieldsAdapter } from './adapters/temporalFields'
import { relationDynamicFieldsAdapter } from './adapters/relationDynamicFields'

const FIELD_ADAPTERS = {
    switch: basicFieldsAdapter,
    'card-switch': basicFieldsAdapter,
    number_formatter: basicFieldsAdapter,
    money: basicFieldsAdapter,
    textarea: basicFieldsAdapter,
    template: basicFieldsAdapter,
    editor: basicFieldsAdapter,
    password: basicFieldsAdapter,
    checkbox: basicFieldsAdapter,
    number: basicFieldsAdapter,
    'number-range': basicFieldsAdapter,
    location: basicFieldsAdapter,

    select: choiceFieldsAdapter,
    'multiple-select': choiceFieldsAdapter,
    'condition-value': choiceFieldsAdapter,
    tags: choiceFieldsAdapter,
    'radio-group': choiceFieldsAdapter,
    'radio-button': choiceFieldsAdapter,

    date: temporalFieldsAdapter,
    datetime: temporalFieldsAdapter,
    'datetime-range': temporalFieldsAdapter,
    'date-range': temporalFieldsAdapter,
    time: temporalFieldsAdapter,

    relation: relationDynamicFieldsAdapter,
    'dynamic-list': relationDynamicFieldsAdapter,
    'dynamic-form-list': relationDynamicFieldsAdapter,
}

export const createRenderField = ({
    values,
    record,
    form,
    context,
    relationOptions,
    relationConfigs,
    loadOptions,
    serverErrors,
    can,
}) => {
    const ctx = {
        values: values || {},
        record,
        form,
        ...context,
    }

    const resolve = (prop, fieldCtx = {}) => {
        if (typeof prop === 'function') {
            return prop(record, {
                ...ctx,
                ...fieldCtx,
            })
        }

        return prop
    }

    const resolvePermission = (field) => {
        if (!field.permission) {
            return { allowed: true, hidden: false, disabled: false }
        }

        const {
            module,
            action,
            mode = 'disabled',
            condition,
        } = field.permission

        if (typeof condition === 'function' && !condition(ctx)) {
            return { allowed: true, hidden: false, disabled: false }
        }

        const allowed = can(module, action)

        if (!allowed) {
            if (mode === 'hidden')
                return { allowed: false, hidden: true, disabled: true }
            if (mode === 'disabled')
                return { allowed: false, hidden: false, disabled: true }
        }

        return { allowed: true, hidden: false, disabled: false }
    }

    const resolveDependentOptions = ({ field, resolvedOptions }) => {
        if (!field.dependsOn) return resolvedOptions

        const config =
            typeof field.dependsOn === 'string'
                ? { field: field.dependsOn, collection: 'items' }
                : field.dependsOn

        const parentValue = ctx.values?.[config.field]
        if (!parentValue) return []

        const parentOptions = relationOptions?.[config.field] || []
        if (!parentOptions.length) return resolvedOptions

        const selectedParent = parentOptions.find(
            (option) => option.value === parentValue,
        )

        return selectedParent?.raw?.[config.collection] || []
    }

    return function renderField(field) {
        const {
            name,
            type = 'text',
            placeholder,
            icon,
            allowClear = true,
            showSearch = true,
            __isInList = false,
            __listIndex = null,
            __row = null,
        } = field

        const hiddenRaw = resolve(field.hidden)
        const disabledRaw = resolve(field.disabled)
        const perm = resolvePermission(field)
        const disabled = disabledRaw || perm.disabled
        const hidden = hiddenRaw || perm.hidden
        const tooltip = resolve(field.tooltip)
        const label = resolve(field.label)
        const extra = resolve(field.extra, { field })
        const options = resolve(field.options, {
            field,
            row: __row,
            listIndex: __listIndex,
        })
        const unit = resolve(field.unit, {
            field,
            row: __row,
            listIndex: __listIndex,
        })
        const source = resolve(field.source)

        if (hidden) return null

        const common = { placeholder, size: 'middle', style: { width: '100%' } }
        const commonRelation = {
            placeholder,
            size: 'middle',
            mode: field.mode,
            style: { width: '100%' },
        }
        const commonInput = {
            ...common,
            allowClear,
            maxLength: field.maxLength,
            showCount: field.showCount,
        }
        const commonSelect = { ...common, allowClear, showSearch }
        const relationKey = getRelationKey(field)

        const wrap = (children, formItemProps = {}) => {
            if (__isInList) return children

            return (
                <FieldContainer
                    field={{ ...field, label, extra }}
                    key={name}
                    ctx={ctx}
                    tooltip={tooltip}
                    serverErrors={serverErrors}
                    formItemProps={formItemProps}
                >
                    {children}
                </FieldContainer>
            )
        }

        const adapter = FIELD_ADAPTERS[type] || basicFieldsAdapter

        return adapter({
            field,
            name,
            type,
            placeholder,
            icon,
            allowClear,
            showSearch,
            __isInList,
            __listIndex,
            __row,
            disabled,
            label,
            options,
            unit,
            source,
            values,
            record,
            form,
            context,
            relationOptions,
            relationConfigs,
            loadOptions,
            serverErrors,
            can,
            ctx,
            common,
            commonRelation,
            commonInput,
            commonSelect,
            relationKey,
            wrap,
            resolve,
            resolveDependentOptions,
            getIcon,
            normalizeOptions,
            getRelationKey,
            renderField,
        })
    }
}
