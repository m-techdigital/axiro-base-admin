import { BaseView } from '@/components/base'
import { Card, Col, Row } from 'antd'
import { buildTransactionDetailFields } from '../config/detailPresentation'
import TransactionAdminActionsPanel from './detail/TransactionAdminActionsPanel'
import TransactionDocumentPanel from './detail/TransactionDocumentPanel'
import TransactionPaymentPanel from './detail/TransactionPaymentPanel'
import TransactionTimelinePanel from './detail/TransactionTimelinePanel'

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
                <TransactionPaymentPanel {...props} />
                <TransactionDocumentPanel {...props} />
            </Col>
            <Col xs={24} xl={9}>
                <TransactionTimelinePanel {...props} />
                <TransactionAdminActionsPanel {...props} />
            </Col>
        </Row>
    )
}
