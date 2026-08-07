import { Card, Col, Flex, Form, Tooltip, Typography } from 'antd'

const { Text } = Typography

export default function FieldContainer({
    field,
    children,
    ctx = {},
    serverErrors = {},
    formItemProps = {},
    tooltip,
}) {
    const {
        name,
        label,
        rules = [],
        span,
        col,
        type,
        required,
        dependencies,
        extra,
    } = field

    const error = serverErrors?.[name]

    // =====================================================
    // GRID SPAN SUPPORT RESPONSIVE
    // =====================================================
    const rawGridSpan = span ?? col ?? { xs: 24, md: 12, lg: 6 }
    const gridSpan =
        typeof rawGridSpan === 'number'
            ? rawGridSpan <= 12
                ? rawGridSpan * 2
                : 24
            : rawGridSpan

    const isCardSwitch = type === 'card-switch'

    // =====================================================
    // CONTEXT HELPERS
    // =====================================================
    const createCtx = (getFieldValue) =>
        Object.freeze({
            getFieldValue,
            values: new Proxy(
                {},
                {
                    get(_, key) {
                        return getFieldValue(key)
                    },
                },
            ),
        })

    const isFieldRequired = (getFieldValue) => {
        const ctxValues = createCtx(getFieldValue)

        if (typeof required === 'function') {
            return required({ ...ctx, ctxValues })
        }

        if (required === true) {
            return true
        }

        return rules.some((rule) => {
            if (typeof rule?.required === 'function') {
                return rule.required({ ...ctx, ctxValues })
            }
            return rule?.required === true
        })
    }

    // =====================================================
    // RULES BUILDER
    // =====================================================
    const buildRules = (rules = []) => {
        const normalized = [...rules]
        const hasRequiredRule = normalized.some((rule) => rule?.required)

        if (required && !hasRequiredRule) {
            normalized.unshift({
                required,
                message: `${label} là bắt buộc`,
            })
        }

        return normalized.map((rule) => {
            if (
                typeof rule === 'object' &&
                typeof rule.required === 'function'
            ) {
                return ({ getFieldValue }) => ({
                    async validator(_, value) {
                        const fieldCtx = createCtx(getFieldValue)

                        const required = rule.required({
                            ...ctx,
                            ctxValues: fieldCtx,
                            ...fieldCtx,
                        })

                        const empty =
                            value === undefined ||
                            value === null ||
                            value === '' ||
                            (Array.isArray(value) && value.length === 0)

                        if (required && empty) {
                            throw new Error(
                                rule.message || `${label} là bắt buộc`,
                            )
                        }
                    },
                })
            }

            if (
                typeof rule === 'object' &&
                typeof rule.validator === 'function'
            ) {
                return ({ getFieldValue }) => ({
                    ...rule,
                    async validator(_, value) {
                        const fieldCtx = createCtx(getFieldValue)

                        await rule.validator(_, value, {
                            ...ctx,
                            ...fieldCtx,
                        })
                    },
                })
            }

            return rule
        })
    }

    const normalizedRules = buildRules(rules)

    // =========================
    // NORMAL FIELD
    // =========================
    const normalField = (
        <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
                <Form.Item
                    name={name}
                    label={label}
                    required={isFieldRequired(getFieldValue)}
                    rules={normalizedRules}
                    dependencies={dependencies}
                    extra={extra}
                    {...formItemProps}
                    help={error}
                    validateStatus={error ? 'error' : undefined}
                >
                    {children}
                </Form.Item>
            )}
        </Form.Item>
    )

    // =========================
    // CARD SWITCH FIELD
    // =========================
    const cardSwitchField = (
        <div className="field-container-card-switch">
            <Card
                size="small"
                style={{
                    borderColor: error
                        ? 'var(--axiro-danger)'
                        : 'var(--axiro-border)',
                }}
            >
                <Flex justify="space-between" align="center">
                    <Flex vertical>
                        <Text strong>{label}</Text>

                        {field.content && (
                            <Text
                                type="secondary"
                                className="field-container-card-switch__content"
                            >
                                {field.content}
                            </Text>
                        )}
                    </Flex>

                    <Form.Item shouldUpdate noStyle>
                        {({ getFieldValue }) => (
                            <Form.Item
                                name={name}
                                valuePropName="checked"
                                trigger="onChange"
                                required={isFieldRequired(getFieldValue)}
                                rules={normalizedRules}
                                dependencies={dependencies}
                                {...formItemProps}
                                style={{ marginBottom: 0 }}
                                help={false}
                                validateStatus={undefined}
                            >
                                {children}
                            </Form.Item>
                        )}
                    </Form.Item>
                </Flex>
            </Card>

            {error && (
                <div className="field-container-card-switch__error">
                    {error}
                </div>
            )}
        </div>
    )

    const formItem = isCardSwitch ? cardSwitchField : normalField

    // =====================================================
    // RESPONSIVE COL SUPPORT
    // =====================================================
    const colProps =
        typeof gridSpan === 'object' ? gridSpan : { span: gridSpan }

    if (!tooltip) {
        return <Col {...colProps}>{formItem}</Col>
    }

    return (
        <Col {...colProps}>
            <Tooltip
                title={tooltip}
                placement="bottomLeft"
                classNames={{ root: 'field-tooltip' }}
            >
                <div style={{ width: '100%' }}>{formItem}</div>
            </Tooltip>
        </Col>
    )
}
