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

    if (!allowed) {
        return hidden ? null : (
            <Tooltip title={tooltip}>
                <Button
                    className="base-button"
                    disabled
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
            <Button className="base-button" {...props}>
                {children}
            </Button>
        </Tooltip>
    )
}
