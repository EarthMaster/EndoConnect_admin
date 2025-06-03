'use client';

import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;

interface Module {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'interactive';
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  duration: string;
}

export default function EducationalModules() {
  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: 'Introduction to Mental Health',
      description: 'Basic concepts and overview of mental health awareness',
      type: 'video',
      status: 'published',
      createdAt: '2024-01-15',
      duration: '10 min',
    },
    {
      id: '2',
      title: 'Stress Management Techniques',
      description: 'Practical strategies for managing daily stress',
      type: 'interactive',
      status: 'published',
      createdAt: '2024-01-20',
      duration: '15 min',
    },
    {
      id: '3',
      title: 'Understanding Anxiety',
      description: 'Comprehensive guide to anxiety disorders',
      type: 'article',
      status: 'draft',
      createdAt: '2024-02-01',
      duration: '8 min',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingModule(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    form.setFieldsValue(module);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setModules(modules.filter(module => module.id !== id));
    message.success('Module deleted successfully');
  };

  const handleSubmit = (values: any) => {
    if (editingModule) {
      const updatedModules = modules.map(module =>
        module.id === editingModule.id ? { ...module, ...values } : module
      );
      setModules(updatedModules);
      message.success('Module updated successfully');
    } else {
      const newModule: Module = {
        id: Date.now().toString(),
        ...values,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setModules([...modules, newModule]);
      message.success('Module created successfully');
    }
    setModalVisible(false);
    form.resetFields();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircleOutlined />;
      case 'article':
        return <FileTextOutlined />;
      case 'interactive':
        return <BookOutlined />;
      default:
        return <BookOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'green';
      case 'draft':
        return 'orange';
      case 'archived':
        return 'red';
      default:
        return 'blue';
    }
  };

  const columns: ColumnsType<Module> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag icon={getTypeIcon(type)} color="blue">
          {type.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Video', value: 'video' },
        { text: 'Article', value: 'article' },
        { text: 'Interactive', value: 'interactive' },
      ],
      onFilter: (value, record) => record.type === value,
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
        { text: 'Published', value: 'published' },
        { text: 'Draft', value: 'draft' },
        { text: 'Archived', value: 'archived' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const moduleStats = {
    total: modules.length,
    published: modules.filter(m => m.status === 'published').length,
    draft: modules.filter(m => m.status === 'draft').length,
    archived: modules.filter(m => m.status === 'archived').length,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Educational Modules Management</h2>
        <p style={{ color: '#666', margin: 0 }}>
          Create and manage educational content for users
        </p>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Modules"
              value={moduleStats.total}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Published"
              value={moduleStats.published}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Draft"
              value={moduleStats.draft}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Archived"
              value={moduleStats.archived}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Modules</h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Module
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={modules}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} modules`,
          }}
        />
      </Card>

      <Modal
        title={editingModule ? 'Edit Module' : 'Add Module'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        destroyOnHidden
        width={600}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            status: 'draft',
            type: 'article',
          }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter the module title' }]}
          >
            <Input placeholder="Enter module title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <TextArea rows={3} placeholder="Enter module description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select a type' }]}
              >
                <Select placeholder="Select module type">
                  <Option value="video">Video</Option>
                  <Option value="article">Article</Option>
                  <Option value="interactive">Interactive</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
                  <Option value="archived">Archived</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: 'Please enter the duration' }]}
          >
            <Input placeholder="e.g., 10 min" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 