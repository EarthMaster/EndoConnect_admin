'use client';

import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Statistic,
  Tabs,
  Progress,
  Rate,
} from 'antd';
import {
  FormOutlined,
  StarOutlined,
  MessageOutlined,
  UserOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface FeedbackResponse {
  id: string;
  userName: string;
  formTitle: string;
  rating: number;
  comment: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'addressed';
}

interface EngagementData {
  id: string;
  formTitle: string;
  totalViews: number;
  totalResponses: number;
  averageRating: number;
  completionRate: number;
  createdAt: string;
}

export default function FeedbackForms() {
  const [feedbackData] = useState<FeedbackResponse[]>([
    {
      id: '1',
      userName: 'John Doe',
      formTitle: 'Module Satisfaction Survey',
      rating: 4,
      comment: 'Very helpful content, well structured.',
      submittedAt: '2024-02-15',
      status: 'new',
    },
    {
      id: '2',
      userName: 'Jane Smith',
      formTitle: 'User Experience Feedback',
      rating: 5,
      comment: 'Excellent platform, easy to navigate.',
      submittedAt: '2024-02-14',
      status: 'reviewed',
    },
    {
      id: '3',
      userName: 'Bob Johnson',
      formTitle: 'Content Quality Assessment',
      rating: 3,
      comment: 'Good content but could be more interactive.',
      submittedAt: '2024-02-13',
      status: 'addressed',
    },
  ]);

  const [engagementData] = useState<EngagementData[]>([
    {
      id: '1',
      formTitle: 'Module Satisfaction Survey',
      totalViews: 150,
      totalResponses: 120,
      averageRating: 4.2,
      completionRate: 80,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      formTitle: 'User Experience Feedback',
      totalViews: 200,
      totalResponses: 145,
      averageRating: 4.5,
      completionRate: 72.5,
      createdAt: '2024-01-20',
    },
    {
      id: '3',
      formTitle: 'Content Quality Assessment',
      totalViews: 95,
      totalResponses: 78,
      averageRating: 3.8,
      completionRate: 82,
      createdAt: '2024-02-01',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'blue';
      case 'reviewed':
        return 'orange';
      case 'addressed':
        return 'green';
      default:
        return 'default';
    }
  };

  const feedbackColumns: ColumnsType<FeedbackResponse> = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Form',
      dataIndex: 'formTitle',
      key: 'formTitle',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'New', value: 'new' },
        { text: 'Reviewed', value: 'reviewed' },
        { text: 'Addressed', value: 'addressed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      sorter: (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
          >
            View
          </Button>
          {record.status === 'new' && (
            <Button
              type="default"
              icon={<CheckCircleOutlined />}
              size="small"
            >
              Mark Reviewed
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const engagementColumns: ColumnsType<EngagementData> = [
    {
      title: 'Form Title',
      dataIndex: 'formTitle',
      key: 'formTitle',
    },
    {
      title: 'Views',
      dataIndex: 'totalViews',
      key: 'totalViews',
      sorter: (a, b) => a.totalViews - b.totalViews,
    },
    {
      title: 'Responses',
      dataIndex: 'totalResponses',
      key: 'totalResponses',
      sorter: (a, b) => a.totalResponses - b.totalResponses,
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (rate: number) => (
        <Progress percent={rate} size="small" />
      ),
      sorter: (a, b) => a.completionRate - b.completionRate,
    },
    {
      title: 'Avg Rating',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating: number) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <span>{rating.toFixed(1)}</span>
        </Space>
      ),
      sorter: (a, b) => a.averageRating - b.averageRating,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  const overallStats = {
    totalFeedback: feedbackData.length,
    newFeedback: feedbackData.filter(f => f.status === 'new').length,
    averageRating: feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length,
    totalViews: engagementData.reduce((sum, e) => sum + e.totalViews, 0),
  };

  const tabItems = [
    {
      key: 'feedback',
      label: 'Feedback Responses',
      children: (
        <Table
          columns={feedbackColumns}
          dataSource={feedbackData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} responses`,
          }}
        />
      ),
    },
    {
      key: 'engagement',
      label: 'Engagement Analytics',
      children: (
        <Table
          columns={engagementColumns}
          dataSource={engagementData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} forms`,
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Feedback Forms & Engagement</h2>
        <p style={{ color: '#666', margin: 0 }}>
          Monitor user feedback and engagement with educational content
        </p>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Feedback"
              value={overallStats.totalFeedback}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="New Feedback"
              value={overallStats.newFeedback}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FormOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Average Rating"
              value={overallStats.averageRating.toFixed(1)}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Views"
              value={overallStats.totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
} 