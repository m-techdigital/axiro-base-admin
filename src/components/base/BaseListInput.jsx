import { Button, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function BaseListInput({
    value = [], // danh sách hiện tại (array các item)
    onChange, // hàm callback trả dữ liệu ngược lên form cha
    fields = [], // config các field con (vd: phone, note...)
    errors = {}, // lỗi validate theo dạng { index: { field: message } }
    addText = 'Thêm', // text nút thêm dòng mới
    defaultItem = {}, // object mặc định khi thêm item mới
}) {
    const listValue = Array.isArray(value) ? value : []

    /**
     * Hàm trung gian:
     * - đảm bảo luôn gọi onChange an toàn
     * - tránh lỗi undefined function
     */
    const triggerChange = (list) => onChange?.(list)

    /**
     * Cập nhật 1 field trong 1 item cụ thể
     *
     * @param index: vị trí item trong list
     * @param field: tên field (vd: phone, note)
     * @param fieldValue: giá trị mới nhập vào input
     */
    const updateItem = (index, field, fieldValue) => {
        const list = [...listValue]

        list[index] = {
            ...list[index],
            [field]: fieldValue,
        }

        triggerChange(list)
    }

    const removeItem = (index) => {
        triggerChange(listValue.filter((_, i) => i !== index))
    }

    const addItem = () => {
        triggerChange([...listValue, { ...defaultItem }])
    }

    return (
        <div className="base-list-input">
            {listValue.map((item, index) => (
                <div key={index} className="base-list-input__item">
                    {fields.map((field, fieldIndex) => {
                        const { key, placeholder } = field
                        const error = errors?.[index]?.[key]

                        return (
                            <div
                                key={key}
                                className={[
                                    'base-list-input__field',
                                    fieldIndex
                                        ? 'base-list-input__field--spaced'
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            >
                                <div className="base-list-input__row">
                                    <div className="base-list-input__control">
                                        <Input
                                            value={item?.[key] ?? ''}
                                            status={error ? 'error' : undefined}
                                            placeholder={
                                                typeof placeholder ===
                                                'function'
                                                    ? placeholder(index)
                                                    : placeholder
                                            }
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    key,
                                                    e.target.value,
                                                )
                                            }
                                        />

                                        {error && (
                                            <div className="base-list-input__error">
                                                {error}
                                            </div>
                                        )}
                                    </div>

                                    {fieldIndex === 0 && (
                                        <Button
                                            onClick={() => removeItem(index)}
                                        >
                                            Xóa
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ))}

            <Button
                block
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addItem}
                style={{ height: 32, borderRadius: 4 }}
            >
                {addText}
            </Button>
        </div>
    )
}
