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
  DatePicker,
  message,
  Row,
  Col,
  Statistic,
  Tabs,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  CalendarOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface ClinicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  dataType: 'clinical' | 'behavioral';
  category: string;
  value: string;
  unit?: string;
  recordedDate: string;
  recordedBy: string;
  notes?: string;
  status: 'active' | 'archived';
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  totalRecords: number;
}

export default function ClinicalDataManagement() {
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([
    {
      id: '1',
      patientId: 'P001',
      patientName: 'John Doe',
      dataType: 'clinical',
      category: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      recordedDate: '2024-02-15',
      recordedBy: 'Dr. Smith',
      notes: 'Normal reading',
      status: 'active',
    },
    {
      id: '2',
      patientId: 'P002',
      patientName: 'Jane Smith',
      dataType: 'behavioral',
      category: 'Anxiety Level',
      value: '3',
      unit: '/10',
      recordedDate: '2024-02-14',
      recordedBy: 'Dr. Johnson',
      notes: 'Mild anxiety reported',
      status: 'active',
    },
    {
      id: '3',
      patientId: 'P001',
      patientName: 'John Doe',
      dataType: 'clinical',
      category: 'Weight',
      value: '75',
      unit: 'kg',
      recordedDate: '2024-02-13',
      recordedBy: 'Nurse Wilson',
      status: 'active',
    },
  ]);

  const [patients] = useState<Patient[]>([
    {
      id: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      lastVisit: '2024-02-15',
      totalRecords: 12,
    },
    {
      id: 'P002',
      name: 'Jane Smith',
      age: 38,
      gender: 'Female',
      lastVisit: '2024-02-14',
      totalRecords: 8,
    },
    {
      id: 'P003',
      name: 'Bob Johnson',
      age: 52,
      gender: 'Male',
      lastVisit: '2024-02-12',
      totalRecords: 15,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ClinicalRecord | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ClinicalRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      recordedDate: dayjs(record.recordedDate),
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setClinicalRecords(clinicalRecords.filter(record => record.id !== id));
    message.success('Record deleted successfully');
  };

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      recordedDate: values.recordedDate.format('YYYY-MM-DD'),
    };

    if (editingRecord) {
      const updatedRecords = clinicalRecords.map(record =>
        record.id === editingRecord.id ? { ...record, ...formattedValues } : record
      );
      setClinicalRecords(updatedRecords);
      message.success('Record updated successfully');
    } else {
      const newRecord: ClinicalRecord = {
        id: Date.now().toString(),
        ...formattedValues,
        patientName: patients.find(p => p.id === formattedValues.patientId)?.name || '',
        recordedBy: 'Admin User', // In real app, get from auth context
        status: 'active',
      };
      setClinicalRecords([...clinicalRecords, newRecord]);
      message.success('Record added successfully');
    }
    setModalVisible(false);
    form.resetFields();
  };

  const getDataTypeColor = (type: string) => {
    return type === 'clinical' ? 'blue' : 'green';
  };

  const clinicalColumns: ColumnsType<ClinicalRecord> = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
    },
    {
      title: 'Type',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (type: string) => (
        <Tag color={getDataTypeColor(type)}>
          {type.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Clinical', value: 'clinical' },
        { text: 'Behavioral', value: 'behavioral' },
      ],
      onFilter: (value, record) => record.dataType === value,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Value',
      key: 'value',
      render: (_, record) => (
        <span>
          {record.value} {record.unit && <small>{record.unit}</small>}
        </span>
      ),
    },
    {
      title: 'Recorded By',
      dataIndex: 'recordedBy',
      key: 'recordedBy',
    },
    {
      title: 'Date',
      dataIndex: 'recordedDate',
      key: 'recordedDate',
      sorter: (a, b) => new Date(a.recordedDate).getTime() - new Date(b.recordedDate).getTime(),
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

  const patientColumns: ColumnsType<Patient> = [
    {
      title: 'Patient ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      sorter: (a, b) => new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime(),
    },
    {
      title: 'Total Records',
      dataIndex: 'totalRecords',
      key: 'totalRecords',
      sorter: (a, b) => a.totalRecords - b.totalRecords,
    },
  ];

  const dataStats = {
    totalRecords: clinicalRecords.length,
    clinicalRecords: clinicalRecords.filter(r => r.dataType === 'clinical').length,
    behavioralRecords: clinicalRecords.filter(r => r.dataType === 'behavioral').length,
    totalPatients: patients.length,
  };

  const categoryOptions = [
    // Clinical categories
    'Blood Pressure', 'Heart Rate', 'Temperature', 'Weight', 'Height',
    'Blood Sugar', 'Cholesterol', 'BMI',
    // Behavioral categories
    'Anxiety Level', 'Depression Score', 'Sleep Quality', 'Stress Level',
    'Mood Rating', 'Activity Level', 'Social Engagement',
  ];

  const tabItems = [
    {
      key: 'records',
      label: 'Clinical Records',
      children: (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>All Records</h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Add Record
            </Button>
          </div>
          <Table
            columns={clinicalColumns}
            dataSource={clinicalRecords}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} records`,
            }}
          />
        </div>
      ),
    },
    {
      key: 'patients',
      label: 'Patient Overview',
      children: (
        <Table
          columns={patientColumns}
          dataSource={patients}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} patients`,
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Clinical Data Management</h2>
        <p style={{ color: '#666', margin: 0 }}>
          Manually update and manage clinical and behavioral data
        </p>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Records"
              value={dataStats.totalRecords}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Clinical Records"
              value={dataStats.clinicalRecords}
              valueStyle={{ color: '#1890ff' }}
              prefix={<HeartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Behavioral Records"
              value={dataStats.behavioralRecords}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Patients"
              value={dataStats.totalPatients}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs items={tabItems} />
      </Card>

      <Modal
        title={editingRecord ? 'Edit Record' : 'Add New Record'}
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
            dataType: 'clinical',
            status: 'active',
            recordedDate: dayjs(),
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="patientId"
                label="Patient"
                rules={[{ required: true, message: 'Please select a patient' }]}
              >
                <Select placeholder="Select patient">
                  {patients.map(patient => (
                    <Option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dataType"
                label="Data Type"
                rules={[{ required: true, message: 'Please select data type' }]}
              >
                <Select placeholder="Select data type">
                  <Option value="clinical">Clinical</Option>
                  <Option value="behavioral">Behavioral</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select or enter category' }]}
          >
            <Select
              placeholder="Select or type category"
              allowClear
              showSearch
            >
              {categoryOptions.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="value"
                label="Value"
                rules={[{ required: true, message: 'Please enter the value' }]}
              >
                <Input placeholder="Enter measurement value" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit"
                label="Unit"
              >
                <Input placeholder="e.g., mmHg, kg, /10" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="recordedDate"
            label="Recorded Date"
            rules={[{ required: true, message: 'Please select the date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={3} placeholder="Additional notes or observations" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 