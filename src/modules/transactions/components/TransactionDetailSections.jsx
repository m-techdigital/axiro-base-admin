import { BaseView } from '@/components/base'
import { Card, Col, Row, Skeleton, Tabs } from 'antd'
import { lazy, Suspense, useMemo, useState } from 'react'

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
    const [activePanel, setActivePanel] = useState('payment')
    const items = useMemo(
        () => [
            {
                key: 'payment',
                label: 'Thanh toán',
                children: (
                    <Suspense fallback={<PanelFallback />}>
                        <TransactionPaymentPanel {...props} />
                    </Suspense>
                ),
            },
            {
                key: 'documents',
                label: 'Tài liệu',
                children: (
                    <Suspense fallback={<PanelFallback />}>
                        <TransactionDocumentPanel {...props} />
                    </Suspense>
                ),
            },
            {
                key: 'timeline',
                label: 'Dòng thời gian',
                children: (
                    <Suspense fallback={<PanelFallback />}>
                        <TransactionTimelinePanel {...props} />
                    </Suspense>
                ),
            },
            {
                key: 'admin',
                label: 'Xử lý quản trị',
                children: (
                    <Suspense fallback={<PanelFallback />}>
                        <TransactionAdminActionsPanel {...props} />
                    </Suspense>
                ),
            },
        ],
        [props],
    )

    return (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
                <Card loading={loading} title="Thông tin giao dịch">
                    <BaseView
                        record={data}
                        columns={2}
                        fields={buildTransactionDetailFields(data)}
                    />
                </Card>
                <Card style={{ marginTop: 16 }}>
                    <Tabs
                        activeKey={activePanel}
                        destroyOnHidden
                        items={items}
                        onChange={setActivePanel}
                    />
                </Card>
            </Col>
        </Row>
    )
}
