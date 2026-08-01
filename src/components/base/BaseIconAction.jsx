import BaseButton from './BaseButton'

export default function BaseIconAction({
    label,
    title,
    icon,
    danger = false,
    type = 'default',
    variant = 'outlined',
    className = '',
    ...props
}) {
    const accessibleLabel = label || title

    return (
        <BaseButton
            aria-label={accessibleLabel}
            className={`base-icon-action ${className}`.trim()}
            danger={danger}
            icon={icon}
            size="small"
            tooltip={accessibleLabel}
            type={type}
            variant={variant}
            {...props}
        />
    )
}
