'use client';

import { Card, Row, Col, Statistic, Empty } from 'antd';
import { BarChartOutlined, UserOutlined, FileTextOutlined, TrophyOutlined } from '@ant-design/icons';

export default function SERPDashboard() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>SERP Dashboard</h2>
        <p style={{ color: '#666', margin: 0 }}>
          Overview of SERP (Search Engine Results Page) analytics and performance metrics
        </p>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Sessions"
              value={0}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed Modules"
              value={0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={0}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Empty
          description={
            <span>
              SERP Dashboard content will be implemented here.
              <br />
              This will include analytics, charts, and performance metrics.
            </span>
          }
        />
      </Card>
    </div>
  );
} 