import { Space } from 'antd'

import BaseButton from './BaseButton'

export default function BaseActionGroup({
    actions = [],
    context,
    children,
    size = 'small',
}) {
    const visibleActions = actions.filter((action) => {
        if (typeof action.hidden === 'function') {
            return !action.hidden(context)
        }

        return !action.hidden
    })

    return (
        <Space className="base-action-group" size={4} wrap>
            {visibleActions.map((action) =>
                action.render ? (
                    <span key={action.key}>{action.render(context)}</span>
                ) : (
                    <BaseButton
                        danger={action.danger}
                        disabled={
                            typeof action.disabled === 'function'
                                ? action.disabled(context)
                                : action.disabled
                        }
                        ghost={action.ghost}
                        icon={action.icon}
                        key={action.key}
                        loading={action.loading}
                        onClick={() => action.onClick?.(context)}
                        size={action.size || size}
                        tooltip={action.tooltip}
                        type={action.type || 'link'}
                    >
                        {action.label}
                    </BaseButton>
                ),
            )}
            {children}
        </Space>
    )
}
