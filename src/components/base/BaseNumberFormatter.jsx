import { InputNumber, Typography, Space } from 'antd'

const { Text } = Typography

export const BaseNumberFormatter = ({
    value,
    onChange,
    disabled,
    unit,
    placeholder,
    min = 0,
    max,
}) => {
    return (
        <Space.Compact style={{ width: '100%' }}>
            <InputNumber
                style={{ width: '100%' }}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                min={min}
                max={max}
                step={1}
                controls={false}
                // =========================
                // FORMAT DISPLAY
                // =========================
                formatter={(v) =>
                    v === null || v === undefined
                        ? ''
                        : Number(v).toLocaleString('vi-VN')
                }
                parser={(v) => {
                    const n = Number(String(v).replace(/[^\d]/g, ''))
                    return Number.isNaN(n) ? 0 : n
                }}
                // =========================
                // SAFE ON CHANGE
                // =========================
                onChange={(val) => {
                    const safe = Number(val || 0)
                    onChange?.(safe)
                }}
            />

            {unit ? (
                <div
                    style={{
                        flex: '0 0 auto',
                        padding: '0 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                        border: '1px solid #d9d9d9',
                        borderLeft: 0,

                        background: '#fafafa',
                        color: '#666',

                        fontSize: 13,
                        whiteSpace: 'nowrap',
                        userSelect: 'none',

                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                    }}
                >
                    <Text type="secondary">{unit}</Text>
                </div>
            ) : null}
        </Space.Compact>
    )
}
