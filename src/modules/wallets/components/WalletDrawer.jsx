import {
    BaseButton,
    BaseDrawer,
    BaseForm,
    BaseModal,
    BaseTable,
} from '@/components/base'
import { Card, Col, Row, Statistic } from 'antd'
import { walletAdjustDefaultValues, walletAdjustFields } from '../formConfig'
import { walletLedgerColumns } from './walletColumns'

function AdjustForm({ onSubmit }) {
    const [form] = BaseForm.useForm()
    return (
        <BaseForm
            fields={walletAdjustFields}
            form={form}
            initialValues={walletAdjustDefaultValues}
            isCancel={false}
            onFinish={onSubmit}
            showFooter
            submitText="Xác nhận điều chỉnh"
        />
    )
}

export default function WalletDrawer({
    open,
    selected,
    ledger,
    onClose,
    onSubmitAdjustment,
}) {
    const showAdjustment = () =>
        BaseModal.confirm({
            title: 'Điều chỉnh số dư',
            icon: null,
            width: 520,
            content: <AdjustForm onSubmit={onSubmitAdjustment} />,
            footer: null,
        })

    return (
        <BaseDrawer
            open={open}
            onClose={onClose}
            width={900}
            title={`Ví khách hàng ${selected?.name || ''}`}
            extra={
                <BaseButton type="primary" onClick={showAdjustment}>
                    Điều chỉnh số dư
                </BaseButton>
            }
        >
            <Row gutter={16}>
                {[
                    ['Số dư khả dụng', ledger?.wallet?.available_balance],
                    ['Số dư tạm giữ', ledger?.wallet?.held_balance],
                    ['Tổng tiền vào', ledger?.wallet?.lifetime_credit],
                    ['Tổng tiền ra', ledger?.wallet?.lifetime_debit],
                ].map(([title, value]) => (
                    <Col span={6} key={title}>
                        <Card>
                            <Statistic
                                title={title}
                                value={Number(value || 0)}
                                suffix="₫"
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <Card title="Lịch sử số dư trước và sau" style={{ marginTop: 16 }}>
                <BaseTable
                    rowKey="id"
                    dataSource={ledger?.transactions?.data || []}
                    pagination={false}
                    columns={walletLedgerColumns}
                />
            </Card>
        </BaseDrawer>
    )
}
