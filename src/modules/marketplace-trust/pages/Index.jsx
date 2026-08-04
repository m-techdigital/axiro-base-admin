import {
    BasePageHeader,
    BaseButton,
    BaseForm,
    BaseModal,
    BaseTable,
} from '@/components/base'
import { Card, Tabs, message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    createTrustModerationFields,
    createTrustModerationInitialValues,
    trustContentDefaultValues,
    trustContentFields,
} from '../formConfig'
import {
    createContentColumns,
    createReviewColumns,
    createRiskColumns,
} from '../columns'
import service from '../service'

const unwrap = (response) => response?.data?.data || response?.data || {}
const rowsOf = (response) => {
    const payload = unwrap(response)
    return Array.isArray(payload) ? payload : payload?.data || []
}
export default function MarketplaceTrustPage() {
    const [tab, setTab] = useState('reviews')
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [contentOpen, setContentOpen] = useState(false)
    const [contentRecord, setContentRecord] = useState(
        trustContentDefaultValues,
    )
    const [form] = BaseForm.useForm()
    const moderationFields = useMemo(
        () => createTrustModerationFields({ tab }),
        [tab],
    )

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response =
                tab === 'content'
                    ? await service.contents()
                    : tab === 'risks'
                      ? await service.risks()
                      : await service.reviews()
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

    const reviewColumns = useMemo(
        () => createReviewColumns({ onSelect: setSelected }),
        [],
    )
    const contentColumns = useMemo(
        () =>
            createContentColumns({
                onEdit: (row) => {
                    setContentRecord(row)
                    setContentOpen(true)
                },
            }),
        [],
    )
    const riskColumns = useMemo(
        () => createRiskColumns({ onSelect: setSelected }),
        [],
    )

    const saveContent = async (values) => {
        try {
            if (values.id) await service.updateContent(values.id, values)
            else await service.createContent(values)
            message.success('Đã lưu nội dung.')
            setContentOpen(false)
            form.resetFields()
            load()
        } catch (error) {
            message.error(error.message || 'Không thể lưu nội dung.')
        }
    }

    const handleSelected = async (values) => {
        try {
            if (tab === 'reviews') {
                await service.moderateReview(selected.id, {
                    status: values.status,
                    note: values.note,
                })
            } else {
                await service.resolveRisk(selected.id, {
                    status: values.status,
                    resolution: values.note,
                })
            }
            message.success('Đã cập nhật.')
            setSelected(null)
            load()
        } catch (error) {
            message.error(error.message || 'Không thể cập nhật.')
        }
    }

    return (
        <div className="page">
            <BasePageHeader
                title="Niềm tin, nội dung và rủi ro"
                description="Kiểm duyệt đánh giá, phát hành nội dung và xử lý cảnh báo rủi ro."
            />
            <Card>
                <Tabs
                    activeKey={tab}
                    items={[
                        { key: 'reviews', label: 'Đánh giá' },
                        { key: 'content', label: 'Nội dung' },
                        { key: 'risks', label: 'Rủi ro' },
                    ]}
                    onChange={setTab}
                    tabBarExtraContent={
                        tab === 'content' ? (
                            <BaseButton
                                onClick={() => {
                                    setContentRecord(trustContentDefaultValues)
                                    setContentOpen(true)
                                }}
                                type="primary"
                            >
                                Thêm nội dung
                            </BaseButton>
                        ) : null
                    }
                />
                <BaseTable
                    columns={
                        tab === 'content'
                            ? contentColumns
                            : tab === 'risks'
                              ? riskColumns
                              : reviewColumns
                    }
                    dataSource={rows}
                    loading={loading}
                    rowKey="id"
                    scroll={{ x: 1000 }}
                />
            </Card>
            <BaseModal
                destroyOnClose
                footer={null}
                onCancel={() => setContentOpen(false)}
                open={contentOpen}
                title="Nội dung Marketplace"
                width={820}
            >
                <BaseForm
                    fields={trustContentFields}
                    form={form}
                    initialValues={trustContentDefaultValues}
                    isCancel={false}
                    onFinish={saveContent}
                    record={contentRecord}
                    showFooter
                    submitText="Lưu nội dung"
                />
            </BaseModal>
            <BaseModal
                footer={null}
                onCancel={() => setSelected(null)}
                open={!!selected}
                title={
                    tab === 'reviews'
                        ? 'Kiểm duyệt đánh giá'
                        : 'Xử lý cảnh báo rủi ro'
                }
            >
                <BaseForm
                    fields={moderationFields}
                    initialValues={createTrustModerationInitialValues({
                        selected,
                        tab,
                    })}
                    isCancel={false}
                    key={`${tab}-${selected?.id}`}
                    onFinish={handleSelected}
                    showFooter
                    submitText="Cập nhật"
                />
            </BaseModal>
        </div>
    )
}
