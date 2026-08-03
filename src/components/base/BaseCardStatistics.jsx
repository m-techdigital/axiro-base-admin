import { useMemo } from 'react'

import { formatCompactCurrency, formatNumber, formatPercent } from '@/utils'
import './BaseCardStatistics.css'

const defaultColumns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
}

const defaultSpan = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 4,
}

function getValue(data, item) {
    if (typeof item.value === 'function') {
        return item.value(data, item)
    }

    if (Object.prototype.hasOwnProperty.call(item, 'value')) {
        return item.value
    }

    if (!item.key) return null

    return String(item.key)
        .split('.')
        .reduce((acc, key) => acc?.[key], data)
}

function formatValue(value, item) {
    const valueType = item.valueType || item.type || item.format

    if (typeof item.renderValue === 'function') {
        return item.renderValue(value, item)
    }

    if (typeof item.formatter === 'function') {
        return item.formatter(value, item)
    }

    if (valueType === 'currency' || valueType === 'money') {
        return formatCompactCurrency(value, item.formatOptions)
    }

    if (valueType === 'percent') {
        return formatPercent(value, item.formatOptions)
    }

    if (valueType === 'text' || valueType === 'string' || valueType === 'raw') {
        return item.suffix ? `${value}${item.suffix}` : value
    }

    const formatted = formatNumber(
        value,
        item.locale || 'vi-VN',
        item.formatOptions,
    )

    const resolved = formatted || value

    return item.suffix ? `${resolved}${item.suffix}` : resolved
}

function resolveContent(content, data, item, value) {
    return typeof content === 'function' ? content(data, item, value) : content
}

function hasContent(value) {
    return (
        value !== null && value !== undefined && value !== false && value !== ''
    )
}

function handleItemKeyDown(event, item, data) {
    if (typeof item.onClick !== 'function') return

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        item.onClick(data, item)
    }
}

function normalizeSpan(span) {
    if (!span) return null

    if (typeof span === 'number') {
        return {
            xs: span,
            sm: span,
            md: span,
            lg: span,
            xl: span,
        }
    }

    return {
        xs: span.xs || defaultSpan.xs,
        sm: span.sm || span.xs || defaultSpan.sm,
        md: span.md || span.sm || span.xs || defaultSpan.md,
        lg: span.lg || span.md || span.sm || span.xs || defaultSpan.lg,
        xl:
            span.xl ||
            span.lg ||
            span.md ||
            span.sm ||
            span.xs ||
            defaultSpan.xl,
    }
}

export default function BaseCardStatistics({
    items = [],
    data = {},
    columns = defaultColumns,
    className = '',
    itemClassName = '',
    emptyValue = '0',
}) {
    const visibleItems = useMemo(
        () => items.filter((item) => !item.hidden),
        [items],
    )
    const useSpanGrid = visibleItems.some((item) => item.span)
    const gridStyle = {
        '--stat-xs': columns.xs || defaultColumns.xs,
        '--stat-sm': columns.sm || defaultColumns.sm,
        '--stat-md': columns.md || defaultColumns.md,
        '--stat-lg': columns.lg || defaultColumns.lg,
        '--stat-xl': columns.xl || defaultColumns.xl,
    }

    return (
        <div
            className={`base-card-statistics mb-4 ${useSpanGrid ? 'base-card-statistics--span' : ''} ${className}`}
            style={gridStyle}
        >
            {visibleItems.map((item, index) => {
                const span = normalizeSpan(item.span)
                const spanStyle = span
                    ? {
                          '--stat-item-xs': span.xs,
                          '--stat-item-sm': span.sm,
                          '--stat-item-md': span.md,
                          '--stat-item-lg': span.lg,
                          '--stat-item-xl': span.xl,
                      }
                    : {}
                const rawValue = getValue(data, item)
                const value =
                    rawValue === null ||
                    rawValue === undefined ||
                    rawValue === ''
                        ? emptyValue
                        : formatValue(rawValue, item)
                const icon = resolveContent(item.icon, data, item, rawValue)
                const label = resolveContent(item.label, data, item, rawValue)
                const content = resolveContent(
                    item.content ?? item.hint,
                    data,
                    item,
                    rawValue,
                )
                const extra = resolveContent(item.extra, data, item, rawValue)
                const rendered = resolveContent(
                    item.render,
                    data,
                    item,
                    rawValue,
                )
                const interactiveProps =
                    typeof item.onClick === 'function'
                        ? {
                              role: 'button',
                              tabIndex: 0,
                              onClick: () => item.onClick(data, item),
                              onKeyDown: (event) =>
                                  handleItemKeyDown(event, item, data),
                              style: { cursor: 'pointer', ...spanStyle },
                          }
                        : { style: spanStyle }

                if (hasContent(rendered)) {
                    return (
                        <div
                            className={`base-card-statistics__item ${itemClassName} ${item.className || ''}`}
                            key={item.key || item.label || index}
                            {...interactiveProps}
                        >
                            {rendered}
                        </div>
                    )
                }

                return (
                    <div
                        className={`base-card-statistics__item ${itemClassName} ${item.className || ''}`}
                        key={item.key || item.label || index}
                        {...interactiveProps}
                    >
                        {hasContent(icon) && (
                            <div
                                className={`base-card-statistics__icon base-card-statistics__icon--${item.tone || item.color || 'blue'}`}
                                style={{
                                    color: item.iconColor,
                                    background: item.iconBackground,
                                }}
                            >
                                {icon}
                            </div>
                        )}
                        <div className="base-card-statistics__body">
                            {hasContent(label) && <span>{label}</span>}
                            <strong>{value}</strong>
                            {hasContent(content) && <small>{content}</small>}
                        </div>
                        {hasContent(extra) && (
                            <div className="base-card-statistics__extra">
                                {extra}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
