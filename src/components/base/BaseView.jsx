import { Row, Col, Typography } from 'antd'
import { renderFieldValue } from '@/utils/fieldRenderer.jsx'

const { Text } = Typography

const getValue = (record, path) => {
    if (!path) return undefined
    if (Array.isArray(path)) {
        return path.reduce((acc, k) => acc?.[k], record)
    }
    return record?.[path]
}

export default function BaseView({
    record = {},
    fields = [],
    tabs = null,
    context = {},
}) {
    const renderField = (field, index) => {
        const value = getValue(record, field.name)

        const hidden =
            typeof field.hidden === 'function'
                ? field.hidden(record, context)
                : field.hidden

        if (hidden) return null

        const content = renderFieldValue(field, value, record)
        if (content === null) return null

        const colProps =
            typeof field.span === 'object'
                ? field.span
                : { span: field.span || 24 }
        const fieldClassName = [
            'base-view-field',
            field.variant ? `base-view-field--${field.variant}` : null,
            field.type ? `base-view-field--type-${field.type}` : null,
            field.className,
        ]
            .filter(Boolean)
            .join(' ')

        return (
            <Col key={field.name || index} {...colProps}>
                <div className={fieldClassName} style={field.style}>
                    <Text className="base-view-field__label" type="secondary">
                        {field.label}
                    </Text>
                    <div className="base-view-field__value">{content}</div>
                </div>
            </Col>
        )
    }

    const renderGroup = (list = []) => (
        <Row gutter={[12, 12]}>{list.map(renderField)}</Row>
    )

    if (tabs?.length) {
        return (
            <div>
                {tabs.map((t) => (
                    <div key={t.key}>
                        <div className="base-view-section-title">{t.label}</div>
                        {t.children || renderGroup(t.fields)}
                    </div>
                ))}
            </div>
        )
    }

    return renderGroup(fields)
}
