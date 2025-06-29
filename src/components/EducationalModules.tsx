'use client';

import { useState, useEffect } from 'react';
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
  Upload,
  message,
  Row,
  Col,
  Statistic,
  Progress,

  Alert,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  UploadOutlined,
  EyeOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

interface EducationalModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'infographic' | 'quiz';
  category: 'sintomas' | 'tratamentos' | 'lifestyle' | 'apoio_emocional' | 'nutricao';
  status: 'rascunho' | 'revisao' | 'publicado' | 'arquivado';
  targetProfile: 'pelvico' | 'intestinal' | 'urinario' | 'emocional' | 'geral';
  estimatedDuration: string;
  completionRate: number;
  totalViews: number;
  language: 'pt-BR';
  uploadedFile?: string;
  createdAt: string;
  lastModified: string;
  createdBy: string;
}

interface ModuleStats {
  totalModules: number;
  publishedModules: number;
  avgCompletionRate: number;
  totalViews: number;
}

export default function EducationalModuleManagement() {
  const [modules, setModules] = useState<EducationalModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<EducationalModule | null>(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState<ModuleStats>({
    totalModules: 0,
    publishedModules: 0,
    avgCompletionRate: 0,
    totalViews: 0
  });

  // Mock data for EndoConnect educational modules
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockModules: EducationalModule[] = [
        {
          id: 'MOD-001',
          title: 'Entendendo a Endometriose: Sintomas e Diagnóstico',
          description: 'Módulo introdutório sobre endometriose, seus sintomas principais e como é feito o diagnóstico.',
      type: 'video',
          category: 'sintomas',
          status: 'publicado',
          targetProfile: 'geral',
          estimatedDuration: '12 min',
          completionRate: 87.3,
          totalViews: 1247,
          language: 'pt-BR',
          uploadedFile: 'endometriose-intro-video.mp4',
          createdAt: '2024-01-10',
          lastModified: '2024-02-05',
          createdBy: 'Dra. Silva'
    },
    {
          id: 'MOD-002',
          title: 'Dor Pélvica: Quando Procurar Ajuda',
          description: 'Infográfico sobre diferentes tipos de dor pélvica e quando buscar ajuda médica.',
          type: 'infographic',
          category: 'sintomas',
          status: 'publicado',
          targetProfile: 'pelvico',
          estimatedDuration: '5 min',
          completionRate: 92.1,
          totalViews: 892,
          language: 'pt-BR',
          uploadedFile: 'dor-pelvica-infografico.pdf',
          createdAt: '2024-01-15',
          lastModified: '2024-01-28',
          createdBy: 'Equipe Médica'
    },
    {
          id: 'MOD-003',
          title: 'Alimentação e Endometriose: Dicas Práticas',
          description: 'Guia prático sobre alimentação anti-inflamatória para mulheres com endometriose.',
      type: 'article',
          category: 'nutricao',
          status: 'revisao',
          targetProfile: 'geral',
          estimatedDuration: '8 min',
          completionRate: 0,
          totalViews: 0,
          language: 'pt-BR',
      createdAt: '2024-02-01',
          lastModified: '2024-02-10',
          createdBy: 'Nutricionista'
        },
        {
          id: 'MOD-004',
          title: 'Sintomas Intestinais e Endometriose',
          description: 'Explicação sobre como a endometriose pode afetar o sistema digestivo.',
          type: 'quiz',
          category: 'sintomas',
          status: 'publicado',
          targetProfile: 'intestinal',
          estimatedDuration: '6 min',
          completionRate: 78.9,
          totalViews: 534,
          language: 'pt-BR',
          createdAt: '2024-01-20',
          lastModified: '2024-01-25',
          createdBy: 'Dr. Santos'
        },
        {
          id: 'MOD-005',
          title: 'Apoio Emocional: Lidando com o Diagnóstico',
          description: 'Vídeo sobre o impacto emocional do diagnóstico e estratégias de enfrentamento.',
          type: 'video',
          category: 'apoio_emocional',
          status: 'rascunho',
          targetProfile: 'emocional',
          estimatedDuration: '15 min',
          completionRate: 0,
          totalViews: 0,
          language: 'pt-BR',
          createdAt: '2024-02-08',
          lastModified: '2024-02-12',
          createdBy: 'Psicóloga'
        }
      ];

      setModules(mockModules);
      
      // Calculate stats
      const published = mockModules.filter(m => m.status === 'publicado');
      const totalCompletionRate = published.reduce((acc, mod) => acc + mod.completionRate, 0);
      const totalViews = mockModules.reduce((acc, mod) => acc + mod.totalViews, 0);
      
      setStats({
        totalModules: mockModules.length,
        publishedModules: published.length,
        avgCompletionRate: published.length > 0 ? totalCompletionRate / published.length : 0,
        totalViews
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddModule = () => {
    setEditingModule(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditModule = (module: EducationalModule) => {
    setEditingModule(module);
    form.setFieldsValue(module);
    setModalVisible(true);
  };

  const handleDeleteModule = async (id: string) => {
    try {
      setModules(modules.filter(m => m.id !== id));
      message.success('Módulo removido com sucesso');
    } catch {
      message.error('Erro ao remover módulo');
    }
  };

  const handleSubmitModule = async (values: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
    if (editingModule) {
        const updatedModules = modules.map(m =>
          m.id === editingModule.id
            ? { ...m, ...values, lastModified: new Date().toISOString().split('T')[0] }
            : m
      );
      setModules(updatedModules);
        message.success('Módulo atualizado com sucesso');
    } else {
        const newModule: EducationalModule = {
          id: `MOD-${(modules.length + 1).toString().padStart(3, '0')}`,
        ...values,
          completionRate: 0,
          totalViews: 0,
          language: 'pt-BR',
        createdAt: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0],
          createdBy: 'Admin User', // In real app, get from auth
      };
      setModules([...modules, newModule]);
        message.success('Módulo criado com sucesso');
    }
    setModalVisible(false);
    form.resetFields();
    } catch {
      message.error('Erro ao salvar módulo');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircleOutlined />;
      case 'article': return <FileTextOutlined />;
      case 'infographic': return <BookOutlined />;
      case 'quiz': return <CheckCircleOutlined />;
      default: return <BookOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publicado': return 'green';
      case 'revisao': return 'orange';
      case 'rascunho': return 'blue';
      case 'arquivado': return 'red';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sintomas': return '🩺';
      case 'tratamentos': return '💊';
      case 'lifestyle': return '🌿';
      case 'apoio_emocional': return '💝';
      case 'nutricao': return '🥗';
      default: return '📚';
    }
  };

  const getProfileIcon = (profile: string) => {
    switch (profile) {
      case 'pelvico': return '🩸';
      case 'intestinal': return '🦠';
      case 'urinario': return '💧';
      case 'emocional': return '🧠';
      case 'geral': return '🌐';
      default: return '❓';
    }
  };

  const moduleColumns: ColumnsType<EducationalModule> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: string) => <Tag color="purple">{id}</Tag>,
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="#5D3FD3">
          {getCategoryIcon(category)} {category.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag icon={getTypeIcon(type)} color="blue">
          {type}
        </Tag>
      ),
    },
    {
      title: 'Perfil Alvo',
      dataIndex: 'targetProfile',
      key: 'targetProfile',
      render: (profile: string) => (
        <Tag color="#A6B1E1">
          {getProfileIcon(profile)} {profile}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Duração',
      dataIndex: 'estimatedDuration',
      key: 'estimatedDuration',
      width: 80,
    },
    {
      title: 'Taxa Conclusão',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (rate: number) => (
        <Progress 
          percent={rate} 
          size="small" 
          status={rate > 80 ? 'success' : rate > 60 ? 'active' : 'exception'}
        />
      ),
    },
    {
      title: 'Visualizações',
      dataIndex: 'totalViews',
      key: 'totalViews',
      sorter: (a, b) => a.totalViews - b.totalViews,
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>
            Ver
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditModule(record)}>
            Editar
          </Button>
          <Button size="small" icon={<DownloadOutlined />}>
            Baixar
          </Button>
          <Popconfirm
            title="Remover módulo?"
            description="Esta ação não pode ser desfeita."
            onConfirm={() => handleDeleteModule(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Remover
          </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/upload', // Mock endpoint
    showUploadList: false,
    beforeUpload: (file) => {
      const isValidType = file.type.includes('video') || file.type.includes('image') || file.type === 'application/pdf';
      if (!isValidType) {
        message.error('Apenas vídeos, imagens ou PDFs são permitidos!');
        return false;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('Arquivo deve ser menor que 100MB!');
        return false;
      }
      return false; // Prevent actual upload in demo
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} enviado com sucesso`);
        form.setFieldsValue({ uploadedFile: info.file.name });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} falha no envio.`);
      }
    },
  };

  return (
    <div style={{ padding: '0 8px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8, color: '#5D3FD3' }}>
          <BookOutlined /> Gestão de Módulos Educativos - EndoConnect
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Gerencie conteúdo educativo sobre endometriose para diferentes perfis sintomáticos
        </p>
      </div>

      <Alert
        message="📚 Trilha Educativa Ativa"
        description="Sistema de módulos educativos personalizados baseado no perfil sintomático da usuária."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total de Módulos"
              value={stats.totalModules}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#5D3FD3' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Módulos Publicados"
              value={stats.publishedModules}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Taxa Conclusão Média"
              value={stats.avgCompletionRate}
              precision={1}
              suffix="%"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#A6B1E1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total de Visualizações"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#F76C6C' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="Módulos Educativos" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddModule}>
            Novo Módulo
          </Button>
        }
      >
        <Table
          columns={moduleColumns}
          dataSource={modules}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} módulos`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Module Form Modal */}
      <Modal
        title={editingModule ? '✏️ Editar Módulo' : '➕ Novo Módulo Educativo'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          onFinish={handleSubmitModule}
          layout="vertical"
          initialValues={{
            status: 'rascunho',
            targetProfile: 'geral',
            language: 'pt-BR'
          }}
        >
          <Form.Item
            name="title"
            label="Título do Módulo"
            rules={[{ required: true, message: 'Digite o título do módulo' }]}
          >
            <Input placeholder="Ex: Entendendo a Endometriose: Sintomas e Diagnóstico" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: 'Digite uma descrição' }]}
          >
            <TextArea rows={3} placeholder="Descreva brevemente o conteúdo do módulo" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Tipo de Conteúdo"
                rules={[{ required: true, message: 'Selecione o tipo' }]}
              >
                <Select placeholder="Selecione o tipo">
                  <Option value="video">📹 Vídeo</Option>
                  <Option value="article">📄 Artigo</Option>
                  <Option value="infographic">📊 Infográfico</Option>
                  <Option value="quiz">❓ Quiz</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Categoria"
                rules={[{ required: true, message: 'Selecione uma categoria' }]}
              >
                <Select placeholder="Selecione a categoria">
                  <Option value="sintomas">🩺 Sintomas</Option>
                  <Option value="tratamentos">💊 Tratamentos</Option>
                  <Option value="lifestyle">🌿 Estilo de Vida</Option>
                  <Option value="apoio_emocional">💝 Apoio Emocional</Option>
                  <Option value="nutricao">🥗 Nutrição</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="targetProfile"
                label="Perfil Alvo"
                rules={[{ required: true, message: 'Selecione o perfil' }]}
              >
                <Select placeholder="Selecione o perfil">
                  <Option value="geral">🌐 Geral</Option>
                  <Option value="pelvico">🩸 Pélvico</Option>
                  <Option value="intestinal">🦠 Intestinal</Option>
                  <Option value="urinario">💧 Urinário</Option>
                  <Option value="emocional">🧠 Emocional</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="estimatedDuration"
                label="Duração Estimada"
                rules={[{ required: true, message: 'Digite a duração' }]}
              >
                <Input placeholder="Ex: 10 min" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Selecione o status' }]}
              >
                <Select>
                  <Option value="rascunho">📝 Rascunho</Option>
                  <Option value="revisao">👀 Em Revisão</Option>
                  <Option value="publicado">✅ Publicado</Option>
                  <Option value="arquivado">📦 Arquivado</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="uploadedFile"
            label="Arquivo do Módulo"
            tooltip="Upload do arquivo de conteúdo (vídeo, PDF, imagem)"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Selecionar Arquivo</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 