import { BaseIconAction } from '@/components/base'
import { EditOutlined } from '@ant-design/icons'
import { Tag, Tooltip } from 'antd'

export const createDocumentTemplateColumns = ({ onEdit, typeLabel = {} }) => [
    { title: 'Mã', dataIndex: 'code' },
    { title: 'Tên mẫu', dataIndex: 'name' },
    {
        title: 'Loại',
        dataIndex: 'type',
        render: (value) => typeLabel[value] || value,
    },
    {
        title: 'Phiên bản',
        dataIndex: 'version',
        render: (value, row) => (
            <Tooltip
                title={
                    row.supersedes
                        ? `Kế tiếp ${row.supersedes.code} v${row.supersedes.version}`
                        : row.supersedes_template_id
                          ? `Kế tiếp mẫu #${row.supersedes_template_id}`
                          : 'Phiên bản đầu'
                }
            >
                <span>
                    v{value}
                    {row.supersedes ? ` · từ v${row.supersedes.version}` : ''}
                </span>
            </Tooltip>
        ),
    },
    {
        title: 'Đã dùng',
        dataIndex: 'generated_documents_count',
        render: (value = 0) => value,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (value) => {
            const status = {
                draft: { label: 'Bản nháp', color: 'gold' },
                published: { label: 'Đã phát hành', color: 'green' },
                deprecated: { label: 'Ngừng sử dụng', color: 'default' },
            }[value] || { label: value, color: 'default' }
            return <Tag color={status.color}>{status.label}</Tag>
        },
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
