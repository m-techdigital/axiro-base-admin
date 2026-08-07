import dayjs from '@/lib/dayjs'
import { Suspense } from 'react'
import { resolveAntIcon } from '@/utils/antIconRegistry'
import {
    Form,
    Col,
    Input,
    Radio,
    Select,
    Checkbox,
    DatePicker,
    TimePicker,
    InputNumber,
    Switch,
    Space,
    Upload,
    Button,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import RelationSelect from '@/components/base/RelationSelect'
import BaseListInput from '@/components/base/BaseListInput'
import { BaseNumberFormatter } from '@/components/base/BaseNumberFormatter'
import FieldContainer from '@/components/base/FieldContainer'
import { normalizeDynamicListErrors } from '@/utils/normalizeDynamicListErrors'

export const fieldComponents = {
    dayjs,
    Suspense,
    Form,
    Col,
    Input,
    Radio,
    Select,
    Checkbox,
    DatePicker,
    TimePicker,
    InputNumber,
    Switch,
    Space,
    Upload,
    Button,
    UploadOutlined,
    RelationSelect,
    BaseListInput,
    BaseNumberFormatter,
    FieldContainer,
    BaseDynamicFormList: null,
    BaseFaceCapture: null,
    BaseLocationForm: null,
    BaseUpload: null,
    BaseImageUpload: null,
    BaseEditor: null,
    normalizeDynamicListErrors,
}

export const getIcon = (icon) => {
    if (!icon) return null
    if (typeof icon === 'string') {
        const C = resolveAntIcon(icon)
        return C ? <C /> : null
    }
    return icon
}

export const normalizeOptions = (options = [], config = {}) =>
    (options || []).map((item) => {
        if (
            item &&
            Object.prototype.hasOwnProperty.call(item, 'value') &&
            Object.prototype.hasOwnProperty.call(item, 'label') &&
            Object.prototype.hasOwnProperty.call(item, 'raw')
        ) {
            return item
        }

        const value = item.value ?? item.id
        let label = item.label ?? item.name

        if (config.labelFormatter) {
            label = config.labelFormatter(item)
        } else if (config.labelKey && item[config.labelKey] !== undefined) {
            label = item[config.labelKey]
        }

        return { value, label, raw: item }
    })

export const normalizeKey = (key) => (Array.isArray(key) ? key.join('.') : key)
export const getRelationKey = (field) =>
    field.__relationKey ||
    normalizeKey(field.name || field.key || field.dataIndex)
