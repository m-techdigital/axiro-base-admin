import { message } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { BaseButton, BaseForm, BaseFormPage } from '@/components/base'

import service from '../service'

const customerSource = {
    module: 'customers',
    method: 'list',
    params: { per_page: 100, status: 'active' },
    valueKey: 'id',
    labelKey: 'name',
    labelFormatter: ({ label, raw }) =>
        `${raw?.code || '—'} - ${label || raw?.username || '—'}`,
    searchFormatter: (item) =>
        `${item?.code || ''} ${item?.name || ''} ${item?.username || ''}`,
    shareCache: true,
    cacheNamespace: 'escrow-box-customers',
}

const fields = [
    {
        name: 'party_a_customer_id',
        label: 'Khách hàng Bên A',
        type: 'relation',
        source: customerSource,
        rules: [{ required: true }],
        span: 6,
    },
    {
        name: 'party_b_customer_id',
        label: 'Khách hàng Bên B',
        type: 'relation',
        source: customerSource,
        rules: [{ required: true }],
        span: 6,
    },
    {
        name: 'deal_type',
        label: 'Loại giao dịch',
        type: 'select',
        options: [
            { value: 'exchange', label: 'Trao đổi ngang' },
            { value: 'exchange_with_topup', label: 'Trao đổi có bù tiền' },
        ],
        rules: [{ required: true }],
        span: 4,
    },
    {
        name: 'topup_payer_side',
        label: 'Bên bù tiền',
        type: 'select',
        options: [
            { value: 'party_a', label: 'Bên A' },
            { value: 'party_b', label: 'Bên B' },
        ],
        hidden: (_, { values }) => values.deal_type !== 'exchange_with_topup',
        span: 4,
    },
    {
        name: 'topup_amount',
        label: 'Số tiền bù',
        type: 'money',
        hidden: (_, { values }) => values.deal_type !== 'exchange_with_topup',
        props: { min: 1000 },
        span: 4,
    },
    {
        name: 'fee_payer_mode',
        label: 'Bên chịu phí',
        type: 'select',
        options: [
            { value: 'party_a', label: 'Bên A' },
            { value: 'party_b', label: 'Bên B' },
            { value: 'split_equal', label: 'Chia đều' },
        ],
        rules: [{ required: true }],
        span: 4,
    },
    {
        name: 'inspection_period_minutes',
        label: 'Thời gian kiểm tra (phút)',
        type: 'number',
        rules: [{ required: true }],
        props: { min: 15, max: 1440 },
        span: 4,
    },
    {
        name: 'expires_in_hours',
        label: 'Link hết hạn sau (giờ)',
        type: 'number',
        props: { min: 1, max: 168 },
        span: 4,
    },
    {
        name: 'party_a_title',
        label: 'Tài sản Bên A',
        rules: [{ required: true }],
        span: 6,
    },
    {
        name: 'party_a_type',
        label: 'Loại tài sản A',
        type: 'select',
        options: ['game_account', 'item', 'redeem_code', 'other'].map(
            (value) => ({ value, label: value }),
        ),
        rules: [{ required: true }],
        span: 3,
    },
    {
        name: 'party_a_delivery_method',
        label: 'Cách bàn giao A',
        type: 'select',
        options: [
            'email_transfer',
            'account_credentials',
            'in_game_trade',
            'redeem_code',
            'admin_observed',
            'other',
        ].map((value) => ({ value, label: value })),
        rules: [{ required: true }],
        span: 3,
    },
    {
        name: 'party_a_description',
        label: 'Mô tả tài sản A',
        type: 'textarea',
        rows: 4,
        rules: [{ required: true }],
        span: 12,
    },
    {
        name: 'party_b_title',
        label: 'Tài sản Bên B',
        rules: [{ required: true }],
        span: 6,
    },
    {
        name: 'party_b_type',
        label: 'Loại tài sản B',
        type: 'select',
        options: ['game_account', 'item', 'redeem_code', 'other'].map(
            (value) => ({ value, label: value }),
        ),
        rules: [{ required: true }],
        span: 3,
    },
    {
        name: 'party_b_delivery_method',
        label: 'Cách bàn giao B',
        type: 'select',
        options: [
            'email_transfer',
            'account_credentials',
            'in_game_trade',
            'redeem_code',
            'admin_observed',
            'other',
        ].map((value) => ({ value, label: value })),
        rules: [{ required: true }],
        span: 3,
    },
    {
        name: 'party_b_description',
        label: 'Mô tả tài sản B',
        type: 'textarea',
        rows: 4,
        rules: [{ required: true }],
        span: 12,
    },
    {
        name: 'success_conditions',
        label: 'Điều kiện hoàn tất',
        type: 'textarea',
        rows: 4,
        rules: [{ required: true }],
        span: 12,
    },
    {
        name: 'cancellation_conditions',
        label: 'Điều kiện hủy',
        type: 'textarea',
        rows: 3,
        span: 12,
    },
    {
        name: 'additional_terms',
        label: 'Điều khoản bổ sung',
        type: 'textarea',
        rows: 3,
        span: 12,
    },
]

const initialValues = {
    deal_type: 'exchange',
    fee_payer_mode: 'party_b',
    inspection_period_minutes: 60,
    expires_in_hours: 72,
    party_a_type: 'game_account',
    party_b_type: 'game_account',
    party_a_delivery_method: 'admin_observed',
    party_b_delivery_method: 'admin_observed',
}

const buildPayload = (values) => ({
    party_a_customer_id: values.party_a_customer_id,
    party_b_customer_id: values.party_b_customer_id,
    deal_type: values.deal_type,
    ...(values.deal_type === 'exchange_with_topup'
        ? {
              topup_payer_side: values.topup_payer_side,
              topup_amount: values.topup_amount,
          }
        : {}),
    fee_payer_mode: values.fee_payer_mode,
    inspection_period_minutes: values.inspection_period_minutes,
    expires_in_hours: values.expires_in_hours,
    party_a_asset: {
        type: values.party_a_type,
        title: values.party_a_title,
        description: values.party_a_description,
        delivery_method: values.party_a_delivery_method,
    },
    party_b_asset: {
        type: values.party_b_type,
        title: values.party_b_title,
        description: values.party_b_description,
        delivery_method: values.party_b_delivery_method,
    },
    success_conditions: values.success_conditions,
    cancellation_conditions: values.cancellation_conditions,
    additional_terms: values.additional_terms,
})

export default function EscrowBoxCreate() {
    const navigate = useNavigate()
    const [form] = BaseForm.useForm()
    const [loading, setLoading] = useState(false)
    const [created, setCreated] = useState(null)
    const origin = useMemo(
        () =>
            (
                import.meta.env.VITE_MBN_APP_URL || window.location.origin
            ).replace(/\/$/, ''),
        [],
    )

    const save = async (values) => {
        setLoading(true)
        try {
            const response = await service.createByAdmin(buildPayload(values))
            setCreated(response.data)
            message.success('Đã tạo box và hai link xác nhận riêng')
        } finally {
            setLoading(false)
        }
    }

    const copy = async (path) => {
        await navigator.clipboard.writeText(`${origin}${path}`)
        message.success('Đã sao chép link')
    }

    if (created) {
        return (
            <BaseFormPage
                title={`Đã tạo ${created.box.code}`}
                description="Mỗi link chỉ hoạt động với đúng khách hàng được Admin chỉ định. Không gửi chéo hai link."
            >
                <div className="base-form-grid">
                    <section>
                        <strong>Link dành cho Bên A</strong>
                        <p>
                            <code>
                                {origin}
                                {created.party_a_invite_path}
                            </code>
                        </p>
                        <BaseButton
                            onClick={() => copy(created.party_a_invite_path)}
                        >
                            Sao chép link Bên A
                        </BaseButton>
                    </section>
                    <section>
                        <strong>Link dành cho Bên B</strong>
                        <p>
                            <code>
                                {origin}
                                {created.party_b_invite_path}
                            </code>
                        </p>
                        <BaseButton
                            onClick={() => copy(created.party_b_invite_path)}
                        >
                            Sao chép link Bên B
                        </BaseButton>
                    </section>
                </div>
                <BaseButton
                    type="primary"
                    onClick={() => navigate(`/escrow-boxes/${created.box.id}`)}
                >
                    Mở chi tiết box
                </BaseButton>
            </BaseFormPage>
        )
    }

    return (
        <BaseFormPage
            title="Tạo Box trung gian cho hai khách hàng"
            description="Admin chọn hai khách hàng nội bộ; mỗi bên nhận một link riêng để xem và xác nhận cùng điều khoản."
        >
            <BaseForm
                fields={fields}
                form={form}
                initialValues={initialValues}
                loading={loading}
                onCancel={() => navigate('/escrow-boxes')}
                onFinish={save}
                showFooter
                submitText="Tạo box và phát hành link"
            />
        </BaseFormPage>
    )
}
