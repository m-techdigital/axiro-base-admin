import { BaseView } from '@/components/base'
import { Card, Col, Row, Skeleton } from 'antd'
import { lazy, Suspense } from 'react'

import { buildTransactionDetailFields } from '../config/detailPresentation'

const TransactionAdminActionsPanel = lazy(
    () => import('./detail/TransactionAdminActionsPanel'),
)
const TransactionDocumentPanel = lazy(
    () => import('./detail/TransactionDocumentPanel'),
)
const TransactionPaymentPanel = lazy(
    () => import('./detail/TransactionPaymentPanel'),
)
const TransactionTimelinePanel = lazy(
    () => import('./detail/TransactionTimelinePanel'),
)

function PanelFallback() {
    return <Skeleton active paragraph={{ rows: 3 }} />
}

export default function TransactionDetailSections(props) {
    const { data, loading } = props
    return (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} xl={15}>
                <Card loading={loading} title="Thông tin giao dịch">
                    <BaseView
                        record={data}
                        columns={2}
                        fields={buildTransactionDetailFields(data)}
                    />
                </Card>
                <Suspense fallback={<PanelFallback />}>
                    <TransactionPaymentPanel {...props} />
                </Suspense>
                <Suspense fallback={<PanelFallback />}>
                    <TransactionDocumentPanel {...props} />
                </Suspense>
            </Col>
            <Col xs={24} xl={9}>
                <Suspense fallback={<PanelFallback />}>
                    <TransactionTimelinePanel {...props} />
                </Suspense>
                <Suspense fallback={<PanelFallback />}>
                    <TransactionAdminActionsPanel {...props} />
                </Suspense>
            </Col>
        </Row>
    )
}
