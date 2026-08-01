import { useMemo } from 'react'
import { Card, Tabs } from 'antd'

import useActiveTab from '@/hooks/useActiveTab'

export default function BaseTabs({
    items = [],
    defaultTab,
    paramName = 'tab',
    activeKey,
    onChange,
    card = true,
    cardProps = {},
    tabsProps = {},
    className,
}) {
    const firstKey = items.find((item) => !item.hidden)?.key
    const fallbackTab = defaultTab || firstKey
    const { activeTab, setActiveTab } = useActiveTab(fallbackTab, paramName)

    const visibleItems = useMemo(
        () =>
            items
                .filter((item) => !item.hidden)
                .map(({ hidden, ...item }) => item),
        [items],
    )

    const currentKey = activeKey ?? activeTab
    const safeActiveKey = visibleItems.some((item) => item.key === currentKey)
        ? currentKey
        : visibleItems[0]?.key

    const handleChange = (key) => {
        if (activeKey === undefined) {
            setActiveTab(key)
        }

        onChange?.(key)
    }

    const content = (
        <Tabs
            destroyOnHidden={false}
            {...tabsProps}
            className={[
                'base-tabs',
                card && 'base-tabs--card',
                className,
                tabsProps.className,
            ]
                .filter(Boolean)
                .join(' ')}
            items={visibleItems}
            activeKey={safeActiveKey}
            onChange={handleChange}
        />
    )

    if (!card) {
        return content
    }

    return (
        <Card
            {...cardProps}
            className={['base-tabs-card', cardProps.className]
                .filter(Boolean)
                .join(' ')}
        >
            {content}
        </Card>
    )
}
