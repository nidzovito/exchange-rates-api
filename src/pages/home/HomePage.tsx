import { useState } from 'react';
import { Typography, Row, Col, Select } from 'antd';

import { Currency, CurrencyLabels } from 'utils/types';
import LiveViewer from './LiveViewer';
import HistoryViewer from './HistoryViewer';

const { Text } = Typography;

function HomePage() {
  const [currencies, setCurrencies] = useState({ base: Currency.USD, target: Currency.BRL });
  const selectOptions = Object.values(Currency).map((e) => ({ value: e, label: CurrencyLabels[e] }));

  return (
    <>
      {/* Filter Bar */}
      <Row justify="space-between" style={{ margin: '2rem 0 1rem 0' }}>
        <Col>
          <Text>{'Target: '}</Text>
          <Select
            size="large"
            value={currencies.target}
            onChange={(newTarget) => setCurrencies((prev) => ({ ...prev, target: newTarget }))}
            options={selectOptions}
          />
        </Col>
        <Col>
          <Text>{'Base: '}</Text>
          <Select size="large" value={currencies.base} options={selectOptions} />
        </Col>
      </Row>
      {/* End of Filter Bar */}

      {/* Content */}
      <Row gutter={64}>
        <Col xs={24} md={12}>
          <LiveViewer {...currencies} />
        </Col>

        <Col xs={24} md={12}>
          <HistoryViewer {...currencies} />
        </Col>
      </Row>
      {/* End of Content */}
    </>
  );
}

export default HomePage;
