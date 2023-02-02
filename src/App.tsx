import { Layout, Typography, Row, Col } from 'antd';

import HomePage from 'pages/home';

import styles from './App.module.scss';

const { Header, Content, Footer } = Layout;
const { Title, Link } = Typography;

function App() {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          Currency Converter
        </Title>
      </Header>

      <Content className={styles.content}>
        <Row justify="center">
          <Col xs={24} md={16}>
            <HomePage />
          </Col>
        </Row>
      </Content>

      <Footer className={styles.footer}>
        Data Source:{' '}
        <Link href="https://exchangeratesapi.io" target="_blank">
          https://exchangeratesapi.io
        </Link>
      </Footer>
    </Layout>
  );
}

export default App;
