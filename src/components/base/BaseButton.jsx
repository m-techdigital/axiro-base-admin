import { Button, Tooltip } from 'antd'

export default function BaseButton({
    tooltip,
    children,
    className = '',
    ...props
}) {
    const button = (
        <Button className={`base-button ${className}`.trim()} {...props}>
            {children}
        </Button>
    )

    return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button
}
