import { BaseButton, BaseForm, BaseTable } from '@/components/base'
import { Card, Tabs, message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeader from '../../../components/base/PageHeader'
import OperationsModals from '../components/OperationsModals'
import {
    createCaseColumns,
    createFeeColumns,
    snapshotColumns,
} from '../components/operationsColumns'
import {
    DEFAULT_FEE_POLICY,
    MARKETPLACE_OPERATION_TABS,
} from '../config/options'
import service from '../service'

const unwrap = (response) => response?.data?.data || response?.data || {}
const rowsOf = (response) => {
    const payload = unwrap(response)
    return Array.isArray(payload) ? payload : payload?.data || []
}

export default function MarketplaceOperationsPage() {
    const [tab, setTab] = useState('cases')
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [feeOpen, setFeeOpen] = useState(false)
    const [form] = BaseForm.useForm()

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response =
                tab === 'fees'
                    ? await service.feePolicies()
                    : tab === 'snapshots'
                      ? await service.snapshots()
                      : await service.cases()
            setRows(rowsOf(response))
        } catch (error) {
            message.error(error.message || 'Không thể tải dữ liệu.')
        } finally {
            setLoading(false)
        }
    }, [tab])

    useEffect(() => {
        load()
    }, [load])

    const openFee = useCallback(
        (fee = DEFAULT_FEE_POLICY) => {
            form.resetFields()
            form.setFieldsValue(fee)
            setFeeOpen(true)
        },
        [form],
    )

    const columns = useMemo(() => {
        if (tab === 'fees') return createFeeColumns({ onEdit: openFee })
        if (tab === 'snapshots') return snapshotColumns
        return createCaseColumns({ onSelect: setSelected })
    }, [openFee, tab])

    const saveFee = async (values) => {
        try {
            const payload = {
                ...values,
                buyer_fixed_fee: values.buyer_fixed_fee || 0,
                seller_fixed_fee: values.seller_fixed_fee || 0,
                tax_rate: values.tax_rate || 0,
                priority: values.priority || 100,
                is_active: Boolean(values.is_active),
            }
            if (values.id) await service.updateFeePolicy(values.id, payload)
            else await service.createFeePolicy(payload)
            message.success('Đã lưu chính sách phí.')
            setFeeOpen(false)
            form.resetFields()
            load()
        } catch (error) {
            message.error(error.message || 'Không thể lưu chính sách phí.')
        }
    }

    const updateCase = async (values) => {
        try {
            await service.updateCase(selected.id, values)
            message.success('Đã cập nhật yêu cầu.')
            setSelected(null)
            load()
        } catch (error) {
            message.error(error.message || 'Không thể cập nhật yêu cầu.')
        }
    }

    return (
        <div className="page">
            <PageHeader
                title="Vận hành Marketplace"
                subtitle="Chính sách phí, trung tâm yêu cầu và biên bản hiện trạng."
            />
            <Card>
                <Tabs
                    activeKey={tab}
                    onChange={setTab}
                    tabBarExtraContent={
                        tab === 'fees' ? (
                            <BaseButton
                                type="primary"
                                onClick={() => openFee()}
                            >
                                Thêm chính sách phí
                            </BaseButton>
                        ) : null
                    }
                    items={MARKETPLACE_OPERATION_TABS}
                />
                <BaseTable
                    rowKey="id"
                    loading={loading}
                    dataSource={rows}
                    columns={columns}
                    scroll={{ x: 1050 }}
                />
            </Card>
            <OperationsModals
                form={form}
                feeOpen={feeOpen}
                selected={selected}
                onCloseFee={() => setFeeOpen(false)}
                onCloseCase={() => setSelected(null)}
                onSaveFee={saveFee}
                onUpdateCase={updateCase}
            />
        </div>
    )
}
