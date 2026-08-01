import { DatePicker, Input } from 'antd'
import { CalendarOutlined, SearchOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

export default function BaseHeaderFilters({
    type = 'keyword',
    className = '',
    value,
    placeholder = 'Tìm kiếm...',
    onChange,
    onSearch,
    format = 'DD/MM/YYYY',
    allowClear = true,
    inputReadOnly = false,
    popupClassName,
}) {
    const rootClassName = [
        'base-header-filter',
        `base-header-filter--${type}`,
        className,
    ]
        .filter(Boolean)
        .join(' ')

    if (type === 'range') {
        return (
            <div className={rootClassName}>
                <RangePicker
                    allowClear={allowClear}
                    value={value}
                    onChange={onChange}
                    format={format}
                    inputReadOnly={inputReadOnly}
                    suffixIcon={<CalendarOutlined />}
                    classNames={
                        popupClassName
                            ? { popup: { root: popupClassName } }
                            : undefined
                    }
                />
            </div>
        )
    }

    return (
        <div className={rootClassName}>
            <Input
                allowClear={allowClear}
                prefix={<SearchOutlined />}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange?.(event.target.value, event)}
                onPressEnter={onSearch}
            />
        </div>
    )
}
