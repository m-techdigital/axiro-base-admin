import { Card, Col, Row, Statistic } from 'antd'
export default function BaseStatisticsGrid({
    items = [],
    loading = false,
    columns = { xs: 12, md: 8, xl: 6 },
    className = '',
}) {
    return (
        <Row
            gutter={[16, 16]}
            className={`base-statistics-grid ${className}`.trim()}
        >
            {items.map((item) => (
                <Col {...columns} key={item.key || item.title}>
                    <Card loading={loading}>
                        <Statistic {...item} />
                    </Card>
                </Col>
            ))}
        </Row>
    )
}
