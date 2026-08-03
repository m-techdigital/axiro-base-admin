import { Tag, Button } from 'antd'

export const renderOption = (options, value, config = {}) => {
    const values = Array.isArray(value) ? value : [value]
    const mode = config?.mode || 'button'

    const renderItem = (opt) => {
        if (mode === 'normal') {
            return (
                <span
                    style={{
                        color: opt.color,
                    }}
                >
                    {opt.label}
                </span>
            )
        }

        if (mode === 'button') {
            return (
                <Button
                    size="small"
                    color={opt.color}
                    variant="outlined"
                    type="default"
                >
                    {opt.label}
                </Button>
            )
        }

        // Text mode keeps option rendering lightweight for read-only fields.
        if (mode === 'text') {
            return <span>{opt.label}</span>
        }

        return opt.color ? <Tag color={opt.color}>{opt.label}</Tag> : opt.label
    }

    return (
        <div
            style={{
                display: 'inline-flex',
                flexWrap: 'wrap',
                gap: 8,
            }}
        >
            {values
                .filter((v) => v !== null && v !== undefined && v !== '')
                .map((v) => {
                    const opt = options.find((o) => o.value === v)

                    return (
                        <span key={String(v)}>
                            {renderItem(opt || { label: v })}
                        </span>
                    )
                })}
        </div>
    )
}
