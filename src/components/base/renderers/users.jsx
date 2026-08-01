import { Avatar, Tooltip, Space } from 'antd'

export const renderUsers = (
    users,
    hasLabel = true,
    size = 18,
    labelStyle = {},
) => {
    const list = Array.isArray(users) ? users : users ? [users] : []

    if (!list.length) return '-'

    const renderAvatar = (user) => {
        const avatarUrl = user?.avatar_url
        const fallback = user?.name?.charAt(0)?.toUpperCase()

        return (
            <Avatar
                size={size}
                className="overflow-hidden"
                src={
                    avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={user?.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : undefined
                }
            >
                {!avatarUrl && fallback}
            </Avatar>
        )
    }

    if (hasLabel) {
        return (
            <Space orientation="vertical" size={4}>
                {list.map((user) => (
                    <Space key={user?.id} size={6}>
                        {renderAvatar(user)}
                        <span style={labelStyle}>{user?.name}</span>
                    </Space>
                ))}
            </Space>
        )
    }

    return (
        <Avatar.Group max={{ count: 3 }}>
            {list.map((user) => (
                <Tooltip key={user?.id} title={user?.name}>
                    {renderAvatar(user)}
                </Tooltip>
            ))}
        </Avatar.Group>
    )
}
