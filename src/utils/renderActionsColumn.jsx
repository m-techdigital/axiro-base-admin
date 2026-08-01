import { BaseButton } from '@/components/base'
import { resolveActionProp } from '@/utils/resolveActionProp'

export const renderActionsColumn = ({ col, record, ctx, onAction }) => {
    const actions = col.actions || []
    const finalCtx = { ...(ctx || {}), record }

    return (
        <div
            className="base-table-action-list"
            style={{ justifyContent: col.align || 'center' }}
        >
            {actions.map((action) => {
                const hidden = resolveActionProp(
                    action.hidden,
                    record,
                    finalCtx,
                )
                if (hidden) return null

                const isDisabled = resolveActionProp(
                    action.disabled,
                    record,
                    finalCtx,
                )
                const color = resolveActionProp(action.color, record, finalCtx)
                const label = resolveActionProp(action.label, record, finalCtx)
                const tooltip = resolveActionProp(
                    action.tooltip,
                    record,
                    finalCtx,
                )
                const Icon = resolveActionProp(action.icon, record, finalCtx)

                const handleClick = () => {
                    const customResult = col.onAction?.(
                        action.key,
                        record,
                        action,
                        finalCtx,
                    )
                    if (customResult !== undefined && customResult !== null) {
                        return customResult
                    }
                    return onAction?.(action.key, record, action, finalCtx)
                }

                return (
                    <BaseButton
                        action={action.action}
                        actions={action.actions}
                        color={color}
                        danger={
                            !!resolveActionProp(action.danger, record, finalCtx)
                        }
                        disabled={isDisabled}
                        icon={Icon ? <Icon /> : null}
                        key={`${action.key}-${record?.id ?? 'row'}`}
                        module={action.module}
                        onClick={handleClick}
                        size="small"
                        tooltip={tooltip || label}
                        type={action.buttonType || 'default'}
                        variant="outlined"
                    >
                        {label}
                    </BaseButton>
                )
            })}
        </div>
    )
}
