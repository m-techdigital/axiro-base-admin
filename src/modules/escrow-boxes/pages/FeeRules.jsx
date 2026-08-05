import { PlusOutlined } from '@ant-design/icons'
import { Switch, message } from 'antd'
import { useEffect, useState } from 'react'

import {
    BaseButton,
    BaseFormModal,
    BaseListView,
    BasePageHeader,
    Money,
} from '@/components/base'
import service from '../service'

const fields = [
    { name: 'code', label: 'Mã', required: true },
    { name: 'name', label: 'Tên quy tắc', required: true },
    {
        name: 'minimum_money_amount',
        label: 'Tiền phát sinh từ',
        type: 'number',
        required: true,
    },
    {
        name: 'maximum_money_amount',
        label: 'Tiền phát sinh đến',
        type: 'number',
    },
    { name: 'base_fee', label: 'Phí cơ bản', type: 'number', required: true },
    {
        name: 'percentage_rate',
        label: 'Tỷ lệ (%)',
        type: 'number',
        required: true,
    },
    {
        name: 'minimum_fee',
        label: 'Phí tối thiểu',
        type: 'number',
        required: true,
    },
    { name: 'maximum_fee', label: 'Phí tối đa', type: 'number' },
    { name: 'priority', label: 'Ưu tiên', type: 'number', required: true },
    { name: 'is_active', label: 'Đang áp dụng', type: 'switch' },
]

const createDefaults = {
    minimum_money_amount: 0,
    base_fee: 50000,
    percentage_rate: 10,
    minimum_fee: 50000,
    priority: 100,
    is_active: true,
}

export default function EscrowFeeRulesPage() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(null)

    const load = async () => {
        setLoading(true)
        try {
            const response = await service.feeRules()
            setData(response.data || [])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const columns = [
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tên', dataIndex: 'name' },
        {
            title: 'Khoảng tiền',
            render: (_, row) => (
                <>
                    <Money value={row.minimum_money_amount} /> —{' '}
                    {row.maximum_money_amount ? (
                        <Money value={row.maximum_money_amount} />
                    ) : (
                        'Không giới hạn'
                    )}
                </>
            ),
        },
        {
            title: 'Phí cơ bản',
            dataIndex: 'base_fee',
            render: (value) => <Money value={value} />,
        },
        {
            title: 'Tỷ lệ',
            dataIndex: 'percentage_rate',
            render: (value) => `${value}%`,
        },
        { title: 'Phiên bản', dataIndex: 'version' },
        {
            title: 'Hoạt động',
            dataIndex: 'is_active',
            render: (value) => <Switch checked={value} disabled />,
        },
        {
            title: 'Thao tác',
            render: (_, row) => (
                <BaseButton
                    onClick={() => {
                        setEditing(row)
                        setOpen(true)
                    }}
                >
                    Chỉnh sửa
                </BaseButton>
            ),
        },
    ]

    return (
        <>
            <BaseListView
                columns={columns}
                data={data}
                loading={loading}
                pagination={false}
                header={
                    <BasePageHeader
                        title="Quy tắc phí Box"
                        description="Phí được snapshot khi Admin duyệt; sửa bảng không làm thay đổi box cũ."
                        actions={
                            <BaseButton
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setEditing(null)
                                    setOpen(true)
                                }}
                            >
                                Thêm quy tắc
                            </BaseButton>
                        }
                    />
                }
            />
            <BaseFormModal
                title={
                    editing ? 'Chỉnh sửa quy tắc phí' : 'Tạo quy tắc phí'
                }
                open={open}
                fields={fields}
                record={editing || createDefaults}
                onCancel={() => setOpen(false)}
                onFinish={async (values) => {
                    if (editing) {
                        await service.updateFeeRule(editing.id, values)
                    } else {
                        await service.createFeeRule(values)
                    }
                    message.success('Đã lưu quy tắc phí')
                    setOpen(false)
                    load()
                }}
                submitText="Lưu"
            />
        </>
    )
}
