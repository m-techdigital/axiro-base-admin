import { BaseIconAction } from '@/components/base'
import { EditOutlined } from '@ant-design/icons'
import { Tag } from 'antd'

export const createDocumentTemplateColumns = ({ onEdit, typeLabel = {} }) => [
    { title: 'Mã', dataIndex: 'code' },
    { title: 'Tên mẫu', dataIndex: 'name' },
    {
        title: 'Loại',
        dataIndex: 'type',
        render: (value) => typeLabel[value] || value,
    },
    { title: 'Phiên bản', dataIndex: 'version' },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (value) => (
            <Tag color={value === 'approved' ? 'green' : 'gold'}>
                {value === 'approved' ? 'Đang áp dụng' : value}
            </Tag>
        ),
    },
    {
        title: 'Thao tác',
        key: 'actions',
        render: (_, record) => (
            <BaseIconAction
                icon={<EditOutlined />}
                label="Chỉnh sửa"
                onClick={() => onEdit(record)}
            />
        ),
    },
]
