import { Button, Card, Col, Descriptions, Drawer, Input, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '../../../components/base/PageHeader';
import service from '../service';

const typeLabels = { business_trail: 'Lịch sử nghiệp vụ', system_operation: 'Thao tác hệ thống', validation: 'Lỗi xác thực dữ liệu', security: 'Sự kiện bảo mật' };
const eventLabels = { created: 'Tạo mới', updated: 'Cập nhật', deleted: 'Xóa', restored: 'Khôi phục', http_mutation: 'Yêu cầu thay đổi', validation_failed: 'Dữ liệu không hợp lệ' };
const riskColors = { normal: 'green', warning: 'gold', high: 'red', critical: 'magenta' };
const pretty = value => value ? JSON.stringify(value, null, 2) : '—';

export default function AuditLogList() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ pagination: {} });
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [params, setParams] = useState({ page: 1, per_page: 30 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, statistics] = await Promise.all([service.list(params), service.statistics()]);
      setRows(list.data || []);
      setMeta(list.meta || { pagination: {} });
      setStats(statistics.data || {});
    } finally { setLoading(false); }
  }, [params]);
  useEffect(() => { load(); }, [load]);

  const columns = useMemo(() => [
    { title: 'Thời gian', dataIndex: 'created_at', width: 165, render: value => new Date(value).toLocaleString('vi-VN') },
    { title: 'Nhóm', dataIndex: 'audit_type', width: 160, render: value => typeLabels[value] || value },
    { title: 'Sự kiện', dataIndex: 'event_type', width: 145, render: value => eventLabels[value] || value },
    { title: 'Mức độ', dataIndex: 'risk_level', width: 100, render: value => <Tag color={riskColors[value] || 'default'}>{value}</Tag> },
    { title: 'Tác nhân', width: 120, render: (_, row) => row.actor_type ? `${row.actor_type} #${row.actor_id || '—'}` : 'Hệ thống' },
    { title: 'Đối tượng', width: 180, render: (_, row) => row.entity_type ? `${row.entity_type} #${row.entity_id || '—'}` : '—' },
    { title: 'Nội dung', dataIndex: 'title', ellipsis: true },
    { title: 'Mã yêu cầu', dataIndex: 'request_id', width: 150, ellipsis: true, render: value => value ? <Typography.Text copyable={{ text: value }}>{value.slice(0, 8)}…</Typography.Text> : '—' },
    { title: '', width: 80, fixed: 'right', render: (_, row) => <Button type="link" onClick={() => setSelected(row)}>Xem</Button> },
  ], []);

  return <div className="page">
    <PageHeader title="Nhật ký và lịch sử hệ thống" actions={<Button onClick={load}>Tải lại</Button>} />
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col xs={12} md={6}><Card><Statistic title="Tổng nhật ký" value={stats.total || 0} /></Card></Col>
      <Col xs={12} md={6}><Card><Statistic title="Trong hôm nay" value={stats.today || 0} /></Card></Col>
      <Col xs={12} md={6}><Card><Statistic title="Lỗi xác thực" value={stats.validation_failures || 0} /></Card></Col>
      <Col xs={12} md={6}><Card><Statistic title="Rủi ro cao" value={stats.high_risk || 0} /></Card></Col>
    </Row>
    <Card>
      <Space wrap style={{ marginBottom: 16 }}>
        <Input.Search allowClear placeholder="Tìm nội dung, đường dẫn" style={{ width: 280 }} onSearch={keyword => setParams(p => ({ ...p, page: 1, keyword }))} />
        <Select allowClear placeholder="Nhóm nhật ký" style={{ width: 190 }} options={Object.entries(typeLabels).map(([value, label]) => ({ value, label }))} onChange={audit_type => setParams(p => ({ ...p, page: 1, audit_type }))} />
        <Select allowClear placeholder="Mức độ" style={{ width: 150 }} options={['normal','warning','high','critical'].map(value => ({ value, label: value }))} onChange={risk_level => setParams(p => ({ ...p, page: 1, risk_level }))} />
      </Space>
      <Table rowKey="id" loading={loading} dataSource={rows} columns={columns} scroll={{ x: 1250 }} pagination={{ current: meta.pagination?.current_page || 1, pageSize: meta.pagination?.per_page || 30, total: meta.pagination?.total || 0, showSizeChanger: true }} onChange={pagination => setParams(p => ({ ...p, page: pagination.current, per_page: pagination.pageSize }))} />
    </Card>
    <Drawer open={!!selected} onClose={() => setSelected(null)} width={760} title="Chi tiết nhật ký">
      {selected && <>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Thời gian">{new Date(selected.created_at).toLocaleString('vi-VN')}</Descriptions.Item>
          <Descriptions.Item label="Mức độ"><Tag color={riskColors[selected.risk_level]}>{selected.risk_level}</Tag></Descriptions.Item>
          <Descriptions.Item label="Nhóm">{typeLabels[selected.audit_type] || selected.audit_type}</Descriptions.Item>
          <Descriptions.Item label="Sự kiện">{eventLabels[selected.event_type] || selected.event_type}</Descriptions.Item>
          <Descriptions.Item label="Tác nhân">{selected.actor_type || 'system'} #{selected.actor_id || '—'}</Descriptions.Item>
          <Descriptions.Item label="Đối tượng">{selected.entity_type || '—'} #{selected.entity_id || '—'}</Descriptions.Item>
          <Descriptions.Item label="Đường dẫn" span={2}>{selected.method} {selected.path}</Descriptions.Item>
          <Descriptions.Item label="Mã yêu cầu" span={2}><Typography.Text copyable>{selected.request_id || '—'}</Typography.Text></Descriptions.Item>
          <Descriptions.Item label="Nội dung" span={2}>{selected.title}<br />{selected.description}</Descriptions.Item>
        </Descriptions>
        {[['Dữ liệu cũ', selected.old_values], ['Dữ liệu mới', selected.new_values], ['Trường thay đổi', selected.changed_fields], ['Lỗi xác thực', selected.validation_errors], ['Dữ liệu bổ sung', selected.metadata]].map(([title, value]) => <Card key={title} size="small" title={title} style={{ marginTop: 16 }}><pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{pretty(value)}</pre></Card>)}
      </>}
    </Drawer>
  </div>;
}
