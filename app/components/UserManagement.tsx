'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  ExperimentOutlined,
  ToolOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface User {
  id: string;
  name: string;
  email: string;
  role: 'clinic_admin' | 'researcher' | 'operator';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  triageLevel?: 'low' | 'medium' | 'high' | 'urgent';
  department?: string;
}

interface TriageCase {
  id: string;
  userId: string;
  userName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  issue: string;
  assignedTo?: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [triageCases, setTriageCases] = useState<TriageCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Mock data - replace with actual API calls
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@clinic.com',
          role: 'clinic_admin',
          status: 'active',
          createdAt: '2024-01-15',
          lastLogin: '2024-02-15',
          department: 'Cardiology',
        },
        {
          id: '2',
          name: 'Dr. Michael Chen',
          email: 'michael.chen@research.com',
          role: 'researcher',
          status: 'active',
          createdAt: '2024-01-20',
          lastLogin: '2024-02-14',
          department: 'Mental Health Research',
        },
        {
          id: '3',
          name: 'Alice Brown',
          email: 'alice.brown@clinic.com',
          role: 'operator',
          status: 'active',
          createdAt: '2024-01-25',
          lastLogin: '2024-02-13',
          department: 'Operations',
        },
        {
          id: '4',
          name: 'Dr. Robert Wilson',
          email: 'robert.wilson@clinic.com',
          role: 'clinic_admin',
          status: 'pending',
          createdAt: '2024-02-01',
          department: 'Psychiatry',
        },
      ];

      const mockTriageCases: TriageCase[] = [
        {
          id: '1',
          userId: '2',
          userName: 'Dr. Michael Chen',
          priority: 'high',
          issue: 'Data access permission needed for new research project',
          assignedTo: 'Dr. Sarah Johnson',
          status: 'in_progress',
          createdAt: '2024-02-15',
        },
        {
          id: '2',
          userId: '3',
          userName: 'Alice Brown',
          priority: 'medium',
          issue: 'System training required for new features',
          status: 'open',
          createdAt: '2024-02-14',
        },
        {
          id: '3',
          userId: '4',
          userName: 'Dr. Robert Wilson',
          priority: 'urgent',
          issue: 'Account activation and role assignment needed',
          status: 'open',
          createdAt: '2024-02-13',
        },
      ];

      setUsers(mockUsers);
      setTriageCases(mockTriageCases);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      setUsers(users.filter(user => user.id !== id));
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingUser) {
        // Update existing user
        const updatedUsers = users.map(user =>
          user.id === editingUser.id
            ? { ...user, ...values }
            : user
        );
        setUsers(updatedUsers);
        message.success('User updated successfully');
      } else {
        // Add new user
        const newUser: User = {
          id: Date.now().toString(),
          ...values,
          status: 'pending', // New users start as pending
          createdAt: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        message.success('User added successfully');
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save user');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'clinic_admin':
        return <CrownOutlined />;
      case 'researcher':
        return <ExperimentOutlined />;
      case 'operator':
        return <ToolOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'clinic_admin':
        return 'red';
      case 'researcher':
        return 'blue';
      case 'operator':
        return 'green';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'blue';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  };

  const userColumns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag icon={getRoleIcon(role)} color={getRoleColor(role)}>
          {role.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Clinic Admin', value: 'clinic_admin' },
        { text: 'Researcher', value: 'researcher' },
        { text: 'Operator', value: 'operator' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
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
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date: string) => date || 'Never',
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
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const triageColumns: ColumnsType<TriageCase> = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Badge
          status={priority === 'urgent' ? 'error' : priority === 'high' ? 'warning' : 'processing'}
          text={
            <Tag color={getPriorityColor(priority)}>
              {priority.toUpperCase()}
            </Tag>
          }
        />
      ),
      sorter: (a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
               priorityOrder[b.priority as keyof typeof priorityOrder];
      },
    },
    {
      title: 'Issue',
      dataIndex: 'issue',
      key: 'issue',
      ellipsis: true,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo: string) => assignedTo || 'Unassigned',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'resolved' ? 'green' : status === 'in_progress' ? 'blue' : 'orange'}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    clinicAdmins: users.filter(u => u.role === 'clinic_admin').length,
    researchers: users.filter(u => u.role === 'researcher').length,
    operators: users.filter(u => u.role === 'operator').length,
  };

  const triageStats = {
    total: triageCases.length,
    urgent: triageCases.filter(t => t.priority === 'urgent').length,
    open: triageCases.filter(t => t.status === 'open').length,
    inProgress: triageCases.filter(t => t.status === 'in_progress').length,
  };

  const tabItems = [
    {
      key: 'users',
      label: 'User Management',
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={userStats.total}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Active Users"
                  value={userStats.active}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Pending Approval"
                  value={userStats.pending}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Clinic Admins"
                  value={userStats.clinicAdmins}
                  prefix={<CrownOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>

          <Card>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Admin Panel Users</h3>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add User
              </Button>
            </div>

            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} users`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'triage',
      label: (
        <span>
          Triage Flow
          {triageStats.urgent > 0 && (
            <Badge count={triageStats.urgent} style={{ marginLeft: 8 }} />
          )}
        </span>
      ),
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Cases"
                  value={triageStats.total}
                  prefix={<AlertOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Urgent Cases"
                  value={triageStats.urgent}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<AlertOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Open Cases"
                  value={triageStats.open}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="In Progress"
                  value={triageStats.inProgress}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>

          <Card>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Triage Cases</h3>
              <p style={{ color: '#666', margin: 0 }}>
                Manage user requests and issues requiring administrative attention
              </p>
            </div>

            <Table
              columns={triageColumns}
              dataSource={triageCases}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} cases`,
              }}
            />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>User Management & Triage</h2>
        <p style={{ color: '#666', margin: 0 }}>
          Manage admin panel users (Clinic Admins, Researchers, Operators) and handle triage workflow
        </p>
      </div>

      <Tabs items={tabItems} />

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        destroyOnHidden
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            status: 'pending',
            role: 'operator',
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter the user name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter the email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select placeholder="Select user role">
                  <Option value="clinic_admin">Clinic Admin</Option>
                  <Option value="researcher">Researcher</Option>
                  <Option value="operator">Operator</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select placeholder="Select user status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="pending">Pending</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please enter the department' }]}
          >
            <Input placeholder="e.g., Cardiology, Mental Health Research, Operations" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 