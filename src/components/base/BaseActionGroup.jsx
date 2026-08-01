import { Children } from 'react'

import BaseButton from './BaseButton'

export default function BaseActionGroup({
    actions = [],
    context,
    children,
    size = 'small',
    className = '',
    align = 'center',
}) {
    const visibleActions = actions.filter((action) => {
        if (typeof action.hidden === 'function') return !action.hidden(context)
        return !action.hidden
    })

    const renderedActions = visibleActions.map((action) =>
        action.render ? (
            action.render(context)
        ) : (
            <BaseButton
                action={action.action}
                actions={action.actions}
                color={
                    typeof action.color === 'function'
                        ? action.color(context)
                        : action.color
                }
                danger={
                    typeof action.danger === 'function'
                        ? action.danger(context)
                        : action.danger
                }
                disabled={
                    typeof action.disabled === 'function'
                        ? action.disabled(context)
                        : action.disabled
                }
                icon={
                    typeof action.icon === 'function'
                        ? action.icon(context)
                        : action.icon
                }
                key={action.key}
                loading={action.loading}
                module={action.module}
                onClick={() => action.onClick?.(context)}
                size={action.size || size}
                tooltip={action.tooltip || action.label}
                type={action.buttonType || action.type || 'default'}
                variant={action.variant || 'outlined'}
            >
                {action.showLabel ? action.label : null}
            </BaseButton>
        ),
    )

    const items = [...renderedActions, ...Children.toArray(children)].filter(
        Boolean,
    )

    if (!items.length) return null

    return (
        <div
            className={`base-action-group ${className}`.trim()}
            role="group"
            style={{ justifyContent: align }}
        >
            {items}
        </div>
    )
}
