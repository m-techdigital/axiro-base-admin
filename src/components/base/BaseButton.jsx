import { Button, Tooltip } from 'antd'
import { usePermission } from '@/hooks/usePermission.jsx'

export default function BaseButton({
    module,
    action,
    actions,
    hidden = true,
    children,
    tooltip,
    ...props
}) {
    const { can } = usePermission()

    const requiredActions =
        Array.isArray(actions) && actions.length
            ? actions
            : action
              ? [action]
              : []
    const allowed =
        module && requiredActions.length
            ? requiredActions.every((item) => can(module, item))
            : true
    const accessibleLabel =
        props['aria-label'] ||
        tooltip ||
        (typeof children === 'string' || typeof children === 'number'
            ? String(children)
            : null) ||
        (props.icon ? 'Thao tác' : null)
    const accessibilityProps =
        accessibleLabel && !props['aria-label']
            ? {
                  'aria-label': accessibleLabel,
                  title: props.title || accessibleLabel,
              }
            : {}

    if (!allowed) {
        return hidden ? null : (
            <Tooltip title={tooltip}>
                <Button
                    className="base-button"
                    disabled
                    {...accessibilityProps}
                    {...props}
                    style={{
                        pointerEvents: 'none',
                        ...props.style,
                    }}
                >
                    {children}
                </Button>
            </Tooltip>
        )
    }

    return (
        <Tooltip title={tooltip}>
            <Button className="base-button" {...accessibilityProps} {...props}>
                {children}
            </Button>
        </Tooltip>
    )
}
