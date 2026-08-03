import {
    ReloadOutlined,
    SearchOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
} from '@ant-design/icons'
import { Col, DatePicker, Dropdown, Form, Input, Row, Select } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'

import { useRelationOptions } from '@/hooks/useRelationOptions'
import { extractRelationConfigs } from '@/utils/extractRelationConfigs'

import BaseButton from './BaseButton'
import RelationSelect from './RelationSelect'

const CONTROL_BY_TYPE = {
    date: DatePicker,
    dateRange: DatePicker.RangePicker,
    select: Select,
    search: Input,
    text: Input,
}

function flattenFields(fields = [], filters = []) {
    if (filters?.length) return filters.flatMap((group) => group.fields || [])
    return fields
}

function normalizeIncomingValue(field, value) {
    if (!value) return value
    if (field.type === 'date')
        return dayjs.isDayjs(value) ? value : dayjs(value)
    if (field.type === 'dateRange' && Array.isArray(value)) {
        return value.map((item) => (dayjs.isDayjs(item) ? item : dayjs(item)))
    }
    return value
}

function normalizeOutgoingValue(field, value) {
    if (!value) return value
    if (field.type === 'date')
        return dayjs.isDayjs(value) ? value.format('YYYY-MM-DD') : value
    if (field.type === 'dateRange' && Array.isArray(value)) {
        return value.map((item) =>
            dayjs.isDayjs(item) ? item.format('YYYY-MM-DD') : item,
        )
    }
    return value
}

const getFieldKey = (name) => (Array.isArray(name) ? name.join('.') : name)

function renderControl(field, context = {}) {
    const Control = CONTROL_BY_TYPE[field.type || 'text'] || Input
    const placeholder = field.placeholder || field.label

    if (field.render) return field.render(field)
    if (field.type === 'relation') {
        const key = getFieldKey(field.name)

        return (
            <RelationSelect
                allowClear={field.allowClear !== false}
                field={field}
                form={context.form}
                loadOptions={context.loadOptions}
                mode={field.mode}
                options={context.relationOptions?.[key] || []}
                placeholder={placeholder}
                showSearch={field.showSearch !== false}
                {...field.controlProps}
            />
        )
    }
    if (field.type === 'select') {
        return (
            <Control
                allowClear={field.allowClear !== false}
                loading={field.loading}
                mode={field.mode}
                optionFilterProp="label"
                options={field.options || []}
                placeholder={placeholder}
                showSearch={field.showSearch !== false}
                {...field.controlProps}
            />
        )
    }
    if (field.type === 'dateRange') {
        return (
            <Control
                allowClear
                format="DD/MM/YYYY"
                placeholder={field.placeholder || ['Từ ngày', 'Đến ngày']}
                {...field.controlProps}
            />
        )
    }
    if (field.type === 'date') {
        return (
            <Control
                allowClear
                format="DD/MM/YYYY"
                placeholder={placeholder}
                {...field.controlProps}
            />
        )
    }
    return (
        <Control
            allowClear={field.allowClear !== false}
            placeholder={placeholder}
            type={field.inputType}
            {...field.controlProps}
        />
    )
}

function normalizeSortItems(sortFields = []) {
    return sortFields.flatMap((field) => {
        if (field.value?.includes(':'))
            return [{ key: field.value, label: field.label }]
        return [
            { key: `${field.value}:asc`, label: `${field.label} tăng dần` },
            { key: `${field.value}:desc`, label: `${field.label} giảm dần` },
        ]
    })
}

export default function BaseFilter({
    className = '',
    fields = [],
    filters = [],
    initialValues,
    loading = false,
    onChange,
    onReset,
    onSearch,
    onSortChange,
    showLabels = false,
    sortFields = [],
    sortValue,
    values = {},
}) {
    const [form] = Form.useForm()
    const allFields = useMemo(
        () => flattenFields(fields, filters),
        [fields, filters],
    )
    const relationConfigs = useMemo(
        () => extractRelationConfigs(allFields, 'name'),
        [allFields],
    )
    const { relationOptions, loadOptions, runCascade } = useRelationOptions(
        relationConfigs,
        form,
        null,
        {},
    )
    const groups = useMemo(
        () => (filters?.length ? filters : [{ key: 'default', fields }]),
        [fields, filters],
    )
    const resolvedValues = useMemo(() => {
        const source = initialValues || values || {}
        return Object.fromEntries(
            allFields.map((field) => [
                field.name,
                normalizeIncomingValue(field, source[field.name]),
            ]),
        )
    }, [allFields, initialValues, values])
    const sortItems = useMemo(
        () => normalizeSortItems(sortFields),
        [sortFields],
    )
    const activeSort = typeof sortValue === 'string' ? sortValue : ''
    const activeDirection = activeSort.split(':')[1]

    useEffect(() => {
        form.setFieldsValue(resolvedValues)
    }, [form, resolvedValues])

    useEffect(() => {
        if (!relationConfigs.length) return
        runCascade(resolvedValues)
    }, [relationConfigs.length, resolvedValues, runCascade])

    const normalizeValues = (rawValues) =>
        Object.fromEntries(
            allFields.map((field) => [
                field.name,
                normalizeOutgoingValue(field, rawValues[field.name]),
            ]),
        )

    const submit = (rawValues) => {
        const normalized = normalizeValues(rawValues)
        onChange?.(normalized)
        onSearch?.(normalized)
    }
    const changed = (_, rawValues) => onChange?.(normalizeValues(rawValues))
    const reset = () => {
        form.resetFields()
        const defaults = initialValues || {}
        form.setFieldsValue(defaults)
        const normalized = normalizeValues(defaults)
        onChange?.(normalized)
        onReset?.(normalized)
    }

    const renderActions = () => (
        <Col className="base-filter-actions-col" flex="none">
            <div className="base-filter-actions">
                {sortItems.length ? (
                    <Dropdown
                        menu={{
                            items: sortItems,
                            onClick: ({ key }) => onSortChange?.(key),
                            selectedKeys: activeSort ? [activeSort] : [],
                        }}
                        trigger={['click']}
                    >
                        <BaseButton
                            className={`base-filter-action base-filter-action--sort ${activeSort ? 'is-active' : ''}`}
                            htmlType="button"
                            icon={
                                activeDirection === 'desc' ? (
                                    <SortDescendingOutlined />
                                ) : (
                                    <SortAscendingOutlined />
                                )
                            }
                            onClick={(event) => event.preventDefault()}
                            tooltip="Sắp xếp"
                        />
                    </Dropdown>
                ) : null}
                <BaseButton
                    className="base-filter-action base-filter-action--reset"
                    htmlType="button"
                    icon={<ReloadOutlined />}
                    onClick={reset}
                    tooltip="Reset bộ lọc"
                />
                <BaseButton
                    className="base-filter-action base-filter-action--search"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                    tooltip="Tìm kiếm"
                    type="primary"
                />
            </div>
        </Col>
    )

    return (
        <div
            className={`base-filter ${showLabels ? 'base-filter--labeled' : 'base-filter--compact'} ${className}`.trim()}
        >
            <Form
                form={form}
                initialValues={resolvedValues}
                layout="vertical"
                onFinish={submit}
                onValuesChange={changed}
            >
                {groups.map((group) => (
                    <Row
                        className="base-filter-row"
                        gutter={[12, 12]}
                        key={group.key || group.label || 'default'}
                    >
                        {(group.fields || [])
                            .filter((field) => !field.hidden)
                            .map((field) => (
                                <Col
                                    flex={field.flex || '1 1 180px'}
                                    key={field.name}
                                >
                                    <Form.Item
                                        className="base-filter-field"
                                        extra={field.extra}
                                        label={
                                            showLabels ? field.label : undefined
                                        }
                                        name={field.name}
                                    >
                                        {renderControl(field, {
                                            form,
                                            loadOptions,
                                            relationOptions,
                                        })}
                                    </Form.Item>
                                </Col>
                            ))}
                        {renderActions()}
                    </Row>
                ))}
            </Form>
        </div>
    )
}
