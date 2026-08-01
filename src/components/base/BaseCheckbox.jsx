import { Checkbox } from 'antd'

import { usePermission } from '@/hooks/usePermission.jsx'
import { ACTIONS } from '@/constants'

export default function BaseCheckbox({
    module,
    action,

    disabled,

    children,
    ...props
}) {
    const { can } = usePermission()

    // ======================
    // NO PERMISSION REQUIRED
    // ======================
    if (!module || !action) {
        return (
            <Checkbox disabled={disabled} {...props}>
                {children}
            </Checkbox>
        )
    }

    // ======================
    // CHECK PERMISSION
    // ======================
    const allowed = can(module, action)

    // READ -> HIDE
    if (!allowed && action === ACTIONS.READ) {
        return null
    }

    // UPDATE -> DISABLE
    return (
        <Checkbox
            disabled={disabled || (!allowed && action === ACTIONS.UPDATE)}
            {...props}
        >
            {children}
        </Checkbox>
    )
}
