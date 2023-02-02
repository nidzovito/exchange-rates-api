import { useCallback, useEffect, useState } from 'react';
import { InputNumber, Typography, Row, Table, Space } from 'antd';
import { PlayCircleTwoTone } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { Currency, TableDataType } from 'utils/types';
import { fetchLiveData } from 'utils/ratesApi';

const { Text, Title } = Typography;

function LiveViewer({ base, target }: { base: Currency; target: Currency }) {
  const [refreshInterval, setRefreshInterval] = useState<number>(1); // in minutes
  const [tableData, setTableData] = useState<TableDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchLiveData({ base, target });
      setTableData((prev) => [result, ...prev]);
    } catch (err: unknown) {
      console.error(err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [base, target]);

  useEffect(() => {
    let poller: number | undefined = undefined;

    if (refreshInterval > 0) {
      setTableData([]);
      loadData();
      poller = window.setInterval(loadData, refreshInterval * 60 * 1000);
    }

    return () => window.clearInterval(poller);
  }, [target, refreshInterval, loadData]);

  const columns: ColumnsType<TableDataType> = [
    {
      title: target,
      dataIndex: 'rate',
      key: 'rate',
      render: (value) => value.toFixed(5)
    },
    {
      title: 'Date & Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (ts) => new Date(ts).toISOString()
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Title level={3}>
        <PlayCircleTwoTone twoToneColor="#52c41a" />
        {' Live Data'}
      </Title>

      <Row align="middle" justify="space-between">
        <Title level={5} style={{ margin: 0 }}>{`1 ${base} equals to`}</Title>
        <Space>
          <Text>Refresh Interval: (in minutes)</Text>
          <InputNumber<number> value={refreshInterval} onChange={(v: any) => setRefreshInterval(v)} size="large" />
        </Space>
      </Row>

      <Table
        rowKey={(record) => record.timestamp}
        size="large"
        columns={columns}
        dataSource={tableData}
        loading={loading}
      />

      {error && <Text type="danger">{error.message || ''}</Text>}
    </Space>
  );
}

export default LiveViewer;
