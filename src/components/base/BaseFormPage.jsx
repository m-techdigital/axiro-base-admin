import { Card } from 'antd'

import BasePageHeader from './BasePageHeader'

export default function BaseFormPage({
    title,
    description,
    actions,
    children,
    className = '',
}) {
    return (
        <section className={`base-form-page ${className}`.trim()}>
            <BasePageHeader
                actions={actions}
                description={description}
                title={title}
            />
            <Card className="base-form-page__card">{children}</Card>
        </section>
    )
}
