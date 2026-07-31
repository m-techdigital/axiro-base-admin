import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select } from 'antd'
import { useEffect, useMemo } from 'react'

const CONTROL_BY_TYPE = {
    select: Select,
    search: Input,
    text: Input,
}

function renderControl(field) {
    const Control = CONTROL_BY_TYPE[field.type || 'text'] || Input

    if (field.type === 'select') {
        return (
            <Control
                allowClear={field.allowClear !== false}
                options={field.options || []}
                placeholder={field.placeholder}
                showSearch={field.showSearch}
                optionFilterProp="label"
            />
        )
    }

    return (
        <Control
            allowClear={field.allowClear !== false}
            placeholder={field.placeholder}
            type={field.inputType}
        />
    )
}

export default function BaseFilter({
    fields = [],
    values = {},
    loading = false,
    onSearch,
    onReset,
    className = '',
}) {
    const [form] = Form.useForm()
    const initialValues = useMemo(() => values || {}, [values])

    useEffect(() => {
        form.setFieldsValue(initialValues)
    }, [form, initialValues])

    const reset = () => {
        form.resetFields()
        onReset?.()
    }

    return (
        <Form
            className={`base-filter ${className}`.trim()}
            form={form}
            initialValues={initialValues}
            onFinish={onSearch}
        >
            <div className="base-filter__fields">
                {fields.map((field) => (
                    <Form.Item
                        className="base-filter__field"
                        key={field.name}
                        label={field.label}
                        name={field.name}
                    >
                        {renderControl(field)}
                    </Form.Item>
                ))}
            </div>

            <div className="base-filter__actions">
                <Button
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                    type="primary"
                >
                    Tìm kiếm
                </Button>
                <Button icon={<ReloadOutlined />} onClick={reset}>
                    Đặt lại
                </Button>
            </div>
        </Form>
    )
}
