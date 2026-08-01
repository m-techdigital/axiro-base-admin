import { Segmented } from 'antd'
import {
    AppstoreOutlined,
    BarChartOutlined,
    BarsOutlined,
} from '@ant-design/icons'

const defaultIconForValue = (value) => {
    if (['table', 'list'].includes(value)) return <BarsOutlined />
    if (value === 'kanban') return <AppstoreOutlined />
    if (value === 'chart') return <BarChartOutlined />
    return undefined
}

export default function BaseViewModeSwitch({
    value,
    onChange,
    options = [],
    size,
    className = '',
    ...props
}) {
    return (
        <Segmented
            className={['view-mode-segmented', className]
                .filter(Boolean)
                .join(' ')}
            value={value}
            onChange={onChange}
            size={size}
            options={options.filter(Boolean).map((option) => ({
                ...option,
                icon: option.icon ?? defaultIconForValue(option.value),
            }))}
            {...props}
        />
    )
}
