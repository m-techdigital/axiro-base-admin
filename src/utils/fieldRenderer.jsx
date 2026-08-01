import { Image, Tag, Switch, Checkbox, Typography } from 'antd'
import dayjs from 'dayjs'
import { formatNumber } from '@/utils/format'
import { formatCurrency as formatMoney } from '@/utils/formatters'
import { renderOption } from '@/components/base/renderers/option.jsx'
import { renderUsers } from '@/components/base/renderers/users.jsx'

const { Text } = Typography

// =========================
// SAFE RESOLVE
// =========================
const resolveLabel = (value, options = []) =>
    options.find((o) => o.value === value)?.label ?? value ?? '-'

const resolveFieldOptions = (field = {}) => {
    if (Array.isArray(field.options)) return field.options

    if (field.labels || field.colors) {
        const keys = new Set([
            ...Object.keys(field.labels || {}),
            ...Object.keys(field.colors || {}),
        ])

        return Array.from(keys).map((value) => ({
            value,
            label: field.labels?.[value] ?? value,
            color: field.colors?.[value],
        }))
    }

    return []
}

const getRecordValue = (record, path) => {
    if (!path) return undefined
    if (Array.isArray(path)) {
        return path.reduce((acc, key) => acc?.[key], record)
    }

    return record?.[path]
}

const renderJsonValue = (value, field = {}) => {
    if (value === null || value === undefined || value === '')
        return field.fallback ?? '-'

    const normalized =
        typeof value === 'string' ? value : JSON.stringify(value, null, 2)
    const content =
        field.maxLength && normalized.length > field.maxLength
            ? `${normalized.slice(0, field.maxLength)}...`
            : normalized

    return (
        <Text
            code
            copyable={field.copyable ?? true}
            style={{ whiteSpace: 'pre-wrap' }}
        >
            {content}
        </Text>
    )
}

const normalizeBooleanLabel = (value) => {
    if (value === true || value === 'true' || value === '1' || value === 1)
        return 'Có'
    if (value === false || value === 'false' || value === '0' || value === 0)
        return 'Không'
    return value || '-'
}

const renderKeyValueList = (items = []) => {
    const visibleItems = items.filter(
        (item) =>
            item.value !== undefined &&
            item.value !== null &&
            item.value !== '',
    )

    if (!visibleItems.length) return '-'

    return (
        <div className="field-kv-list">
            {visibleItems.map((item) => (
                <div key={item.label} className="field-kv-list__item">
                    <Text className="field-kv-list__label" type="secondary">
                        {item.label}
                    </Text>
                    <Text
                        className="field-kv-list__value"
                        strong
                        copyable={item.copyable ?? false}
                    >
                        {item.value}
                    </Text>
                </div>
            ))}
        </div>
    )
}

const renderNetworkValue = (value) => {
    const network =
        typeof value === 'string'
            ? (() => {
                  try {
                      return JSON.parse(value)
                  } catch {
                      return {}
                  }
              })()
            : value

    if (!network || typeof network !== 'object') return '-'

    return renderKeyValueList([
        { label: 'Đang online', value: normalizeBooleanLabel(network.online) },
        { label: 'IP ghi nhận', value: network.server_ip },
        {
            label: 'Loại mạng',
            value: network.effective_type || network.effectiveType,
        },
        {
            label: 'Tốc độ ước tính',
            value: network.downlink ? `${network.downlink} Mbps` : null,
        },
        { label: 'Độ trễ', value: network.rtt ? `${network.rtt} ms` : null },
        {
            label: 'Tiết kiệm dữ liệu',
            value: normalizeBooleanLabel(network.save_data ?? network.saveData),
        },
    ])
}

const renderDeviceValue = (value) => {
    const device =
        typeof value === 'string'
            ? (() => {
                  try {
                      return JSON.parse(value)
                  } catch {
                      return {}
                  }
              })()
            : value

    if (!device || typeof device !== 'object') return '-'

    return renderKeyValueList([
        { label: 'Thiết bị/Nền tảng', value: device.platform },
        { label: 'Ngôn ngữ', value: device.language },
        { label: 'Màn hình', value: device.screen },
        { label: 'Múi giờ', value: device.client_timezone },
        {
            label: 'Thời điểm thiết bị gửi',
            value: device.client_captured_at
                ? dayjs(device.client_captured_at).format('DD/MM/YYYY HH:mm:ss')
                : null,
        },
        { label: 'Trình duyệt', value: device.user_agent, copyable: true },
        {
            label: 'User-Agent server nhận',
            value: device.server_user_agent,
            copyable: true,
        },
    ])
}

const renderLocationValue = (value, field = {}, record = {}) => {
    const lat = getRecordValue(record, field.latName)
    const lng = getRecordValue(record, field.lngName)
    const accuracy = getRecordValue(record, field.accuracyName)
    const error = getRecordValue(record, field.errorName)
    const coords =
        lat && lng
            ? `${Number(lat).toFixed(7)}, ${Number(lng).toFixed(7)}`
            : null

    return renderKeyValueList([
        { label: 'Địa chỉ/Tọa độ tự ghi nhận', value },
        { label: 'Tọa độ', value: coords },
        {
            label: 'Độ chính xác GPS',
            value: accuracy ? `${Math.round(Number(accuracy))} m` : null,
        },
        {
            label: 'Trạng thái vị trí',
            value: coords
                ? 'Đã xác định'
                : error || 'Chưa xác định được vị trí',
        },
    ])
}

// =========================
// MAIN FIELD RENDERER
// =========================
export const renderFieldValue = (field, value, record) => {
    if (field.render) {
        return field.render(value, record)
    }

    if (
        !['location', 'network', 'device'].includes(field.type) &&
        (value === null || value === undefined || value === '')
    ) {
        return '-'
    }

    switch (field.type) {
        case 'text':
            return value

        case 'switch':
            return <Switch checked={!!value} disabled />

        case 'checkbox':
            return <Checkbox checked={!!value} disabled />

        case 'date':
            return value ? dayjs(value).format('DD/MM/YYYY') : '-'

        case 'datetime':
            return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-'

        // =========================
        // SELECT (FIX YOUR ISSUE)
        // =========================
        case 'select':
        case 'multiple-select':
            return renderOption(field.options || [], value, {
                mode: field.mode,
            })

        case 'relation':
            return <Tag>{resolveLabel(value, field.options)}</Tag>

        case 'option':
        case 'option_tag':
            return renderOption(resolveFieldOptions(field), value, {
                ...field,
                mode:
                    field.mode ||
                    (field.type === 'option_tag' ? 'tag' : 'text'),
            })

        case 'tags':
            return Array.isArray(value) ? (
                value.map((v) => <Tag key={v}>{v}</Tag>)
            ) : (
                <Tag>{value}</Tag>
            )

        case 'users':
            return renderUsers(
                value,
                field.hasLabel ?? true,
                field.size ?? 18,
                field.labelStyle ?? {},
            )

        case 'number':
            return value?.toLocaleString?.() ?? value

        case 'money':
            return formatMoney(value, {
                compact: field.compact ?? false,
                currency: field.currency ?? 'đ',
                fallback: '-',
            })

        case 'image':
            return (
                <div className="field-image-frame">
                    <Image
                        src={value}
                        alt={field.label || 'Ảnh'}
                        width="100%"
                        height="100%"
                        style={{
                            objectFit: field.objectFit || 'cover',
                            ...field.imageStyle,
                        }}
                    />
                </div>
            )

        case 'number_formatter':
            return (
                <>
                    {formatNumber(value)}
                    {field.unit && (
                        <span style={{ marginLeft: 4 }}>{field.unit}</span>
                    )}
                </>
            )

        case 'editor':
            return (
                <div
                    className="editor-viewer"
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            )

        case 'description-box':
            return (
                <div
                    className="editor-viewer"
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            )

        case 'json':
            return renderJsonValue(value, field)

        case 'network':
            return renderNetworkValue(value)

        case 'device':
            return renderDeviceValue(value)

        case 'location':
            return renderLocationValue(value, field, record)

        default:
            if (typeof value === 'object') {
                return (
                    value?.name ||
                    value?.label ||
                    value?.title ||
                    renderJsonValue(value, { copyable: false })
                )
            }

            return value
    }
}
