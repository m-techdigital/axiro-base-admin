import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { Input, Select, Space, message } from 'antd'
import { useState } from 'react'

import { BaseButton } from '@/components/base'
import { useSavedFilterPresets } from '@/hooks'

export default function FilterPresetBar({ storageKey, values, onApply }) {
    const [name, setName] = useState('')
    const { presets, save, remove } = useSavedFilterPresets(storageKey)

    return (
        <Space wrap>
            <Select
                allowClear
                placeholder="Bộ lọc đã lưu"
                style={{ minWidth: 220 }}
                options={presets.map((preset) => ({
                    value: preset.name,
                    label: preset.name,
                }))}
                onChange={(selected) => {
                    const preset = presets.find(
                        (item) => item.name === selected,
                    )
                    if (preset) onApply(preset.values)
                }}
            />
            <Input
                placeholder="Tên bộ lọc"
                style={{ width: 180 }}
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <BaseButton
                icon={<SaveOutlined />}
                onClick={() => {
                    if (!name.trim()) return message.warning('Nhập tên bộ lọc.')
                    save(name, values)
                    setName('')
                    message.success('Đã lưu bộ lọc.')
                }}
            >
                Lưu
            </BaseButton>
            <BaseButton
                danger
                icon={<DeleteOutlined />}
                disabled={!presets.length}
                onClick={() => {
                    const latest = presets.at(-1)
                    if (latest) {
                        remove(latest.name)
                        message.success(`Đã xóa bộ lọc “${latest.name}”.`)
                    }
                }}
            >
                Xóa gần nhất
            </BaseButton>
        </Space>
    )
}
