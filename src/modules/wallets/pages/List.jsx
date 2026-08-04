import {
    BasePageHeader,
    BaseButton,
    BaseFilter,
    BaseTable,
} from '@/components/base'
import { Card, Space } from 'antd'
import WalletDrawer from '../components/WalletDrawer'
import { walletFilterFields } from '../config/options'
import { useWalletCenter } from '../hooks/useWalletCenter'

export default function WalletList() {
    const center = useWalletCenter()

    return (
        <div className="page">
            <BasePageHeader
                title="Ví và dòng tiền khách hàng"
                actions={
                    <Space>
                        <BaseFilter
                            fields={walletFilterFields}
                            loading={center.loading}
                            onReset={() => center.setFilters({ keyword: '' })}
                            onSearch={(values) =>
                                center.setFilters({
                                    keyword: values.keyword || '',
                                })
                            }
                            values={center.filters}
                        />
                        <BaseButton onClick={center.load}>Tải lại</BaseButton>
                    </Space>
                }
            />
            <Card>
                <BaseTable
                    rowKey="id"
                    loading={center.loading}
                    dataSource={center.rows}
                    columns={center.columns}
                    pagination={false}
                />
            </Card>
            <WalletDrawer
                open={center.drawer}
                selected={center.selected}
                ledger={center.ledger}
                onClose={() => center.setDrawer(false)}
                onSubmitAdjustment={center.submitAdjustment}
            />
        </div>
    )
}
