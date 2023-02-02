import { useEffect, useState } from 'react';
import { Typography, Space, Radio } from 'antd';
import { Line } from '@ant-design/plots';
import { LineChartOutlined } from '@ant-design/icons';

import { Currency, DateRange, GraphDataType } from 'utils/types';
import { fetchHistoryData } from 'utils/ratesApi';

const { Text, Title } = Typography;

function HistoryViewer({ base, target }: { base: Currency; target: Currency }) {
  const [range, setRange] = useState(DateRange.OneWeek);
  const [graphData, setGraphData] = useState<GraphDataType[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const dateRangeOptions = Object.values(DateRange).map((e) => ({ value: e, label: e }));

  useEffect(() => {
    const loadData = async () => {
      try {
        setGraphData([]);
        const result = await fetchHistoryData({ base, target, range });
        setGraphData(result);
      } catch (err: unknown) {
        console.error(err);
        setError(err as Error);
      }
    };

    loadData();
  }, [base, target, range]);

  const graphConfig = {
    data: graphData,
    xField: 'date',
    yField: 'rate',
    point: {
      size: 4,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9'
      }
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Title level={3}>
        <LineChartOutlined />
        {' History Data'}
      </Title>

      <Radio.Group
        options={dateRangeOptions}
        onChange={(e) => setRange(e.target.value)}
        value={range}
        optionType="button"
        buttonStyle="solid"
      />

      <Line {...graphConfig}></Line>

      {error && <Text type="danger">{error.message || ''}</Text>}
    </Space>
  );
}

export default HistoryViewer;
