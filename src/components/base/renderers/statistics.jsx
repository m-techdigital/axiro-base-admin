import React from 'react'
import { Card, Statistic } from 'antd'

function formatMoney(value, unit = 'auto') {
    const number = Number(value) || 0

    if (unit === 'vnd') {
        return {
            value: number.toLocaleString('vi-VN'),
            suffix: 'đ',
        }
    }

    if (unit === 'million') {
        return {
            value: +(number / 1_000_000).toFixed(2),
            suffix: 'triệu',
        }
    }

    if (unit === 'billion') {
        return {
            value: +(number / 1_000_000_000).toFixed(2),
            suffix: 'tỷ',
        }
    }

    // auto
    if (Math.abs(number) >= 1_000_000_000) {
        return {
            value: +(number / 1_000_000_000).toFixed(2),
            suffix: 'tỷ',
        }
    }

    if (Math.abs(number) >= 1_000_000) {
        return {
            value: +(number / 1_000_000).toFixed(2),
            suffix: 'triệu',
        }
    }

    return {
        value: number.toLocaleString('vi-VN'),
        suffix: 'đ',
    }
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => {
        return acc?.[key]
    }, obj)
}

export function renderStatistics(item, data) {
    let value = getNestedValue(data, item.key)
    let suffix = item.suffix

    if (Array.isArray(value)) {
        value = value.length
    } else if (value && typeof value === 'object') {
        value = JSON.stringify(value)
    }

    if (value == null) {
        value = 0
    }

    if (item.type === 'money') {
        const result = formatMoney(value, item.moneyUnit)
        value = result.value
        suffix = result.suffix
    }

    return (
        <Card
            hoverable
            style={{ height: '100%' }}
            styles={{
                body: {
                    textAlign: item.align || 'left',
                },
            }}
        >
            <Statistic
                title={item.label}
                value={value}
                suffix={suffix}
                precision={item.precision}
                formatter={item.formatter}
            />
        </Card>
    )
}
