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
  Switch,
  Radio,
  Divider,
  Alert,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  EyeOutlined,
  CopyOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;

interface ScreeningQuestion {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'scale' | 'yes_no' | 'text';
  category: 'dor_pelvica' | 'sintomas_intestinais' | 'sintomas_urinarios' | 'aspecto_emocional' | 'historico_familiar';
  options?: string[];
  isRequired: boolean;
  order: number;
  isActive: boolean;
  conditionLogic?: string;
  profileWeight: {
    pelvico: number;
    intestinal: number;
    urinario: number;
    emocional: number;
  };
  createdAt: string;
  lastModified: string;
}

interface TriageFlow {
  id: string;
  name: string;
  version: string;
  questions: string[];
  isActive: boolean;
  totalResponses: number;
  completionRate: number;
  avgTimeToComplete: string;
}

export default function ScreeningQuestionManagement() {
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);
  const [flows, setFlows] = useState<TriageFlow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [flowModalVisible, setFlowModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ScreeningQuestion | null>(null);
  const [editingFlow, setEditingFlow] = useState<TriageFlow | null>(null);
  const [form] = Form.useForm();
  const [flowForm] = Form.useForm();

  // Mock data for EndoConnect screening questions
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockQuestions: ScreeningQuestion[] = [
        {
          id: 'Q001',
          questionText: 'Com que frequência você sente dor pélvica?',
          questionType: 'multiple_choice',
          category: 'dor_pelvica',
          options: ['Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
          isRequired: true,
          order: 1,
          isActive: true,
          profileWeight: { pelvico: 0.8, intestinal: 0.1, urinario: 0.1, emocional: 0.2 },
          createdAt: '2024-01-15',
          lastModified: '2024-02-10'
    },
    {
          id: 'Q002',
          questionText: 'A dor piora durante a menstruação?',
          questionType: 'yes_no',
          category: 'dor_pelvica',
          isRequired: true,
          order: 2,
          isActive: true,
          conditionLogic: 'Q001 != "Raramente"',
          profileWeight: { pelvico: 0.9, intestinal: 0.0, urinario: 0.0, emocional: 0.1 },
          createdAt: '2024-01-15',
          lastModified: '2024-02-08'
    },
    {
          id: 'Q003',
          questionText: 'Você apresenta sintomas intestinais (diarreia, constipação, distensão)?',
          questionType: 'multiple_choice',
          category: 'sintomas_intestinais',
          options: ['Nunca', 'Raramente', 'Durante a menstruação', 'Sempre'],
          isRequired: true,
          order: 3,
          isActive: true,
          profileWeight: { pelvico: 0.1, intestinal: 0.9, urinario: 0.1, emocional: 0.0 },
          createdAt: '2024-01-16',
          lastModified: '2024-02-09'
        },
        {
          id: 'Q004',
          questionText: 'Sente dor ou desconforto ao urinar?',
          questionType: 'scale',
          category: 'sintomas_urinarios',
          options: ['0 - Nunca', '1', '2', '3', '4', '5 - Sempre'],
          isRequired: true,
          order: 4,
          isActive: true,
          profileWeight: { pelvico: 0.2, intestinal: 0.0, urinario: 0.8, emocional: 0.1 },
          createdAt: '2024-01-16',
          lastModified: '2024-02-07'
        },
    {
          id: 'Q005',
          questionText: 'Como você avaliaria seu nível de ansiedade relacionado aos sintomas?',
          questionType: 'scale',
          category: 'aspecto_emocional',
          options: ['0 - Muito baixo', '1', '2', '3', '4', '5 - Muito alto'],
          isRequired: false,
          order: 5,
          isActive: true,
          profileWeight: { pelvico: 0.1, intestinal: 0.1, urinario: 0.1, emocional: 0.9 },
          createdAt: '2024-01-17',
          lastModified: '2024-02-06'
        }
      ];

      const mockFlows: TriageFlow[] = [
        {
          id: 'FLOW-001',
          name: 'Triagem Principal EndoConnect v1.0',
          version: '1.0',
          questions: ['Q001', 'Q002', 'Q003', 'Q004', 'Q005'],
          isActive: true,
          totalResponses: 312,
          completionRate: 94.2,
          avgTimeToComplete: '4m 32s'
        },
        {
          id: 'FLOW-002',
          name: 'Triagem Rápida (Piloto)',
          version: '0.9',
          questions: ['Q001', 'Q003', 'Q005'],
          isActive: false,
          totalResponses: 48,
          completionRate: 87.5,
          avgTimeToComplete: '2m 15s'
        }
      ];

      setQuestions(mockQuestions);
      setFlows(mockFlows);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditQuestion = (question: ScreeningQuestion) => {
    setEditingQuestion(question);
    form.setFieldsValue({
      ...question,
      options: question.options?.join('\n')
    });
    setModalVisible(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      setQuestions(questions.filter(q => q.id !== id));
      message.success('Pergunta removida com sucesso');
    } catch (error) {
      message.error('Erro ao remover pergunta');
    }
  };

  const handleSubmitQuestion = async (values: any) => {
    try {
      const questionData = {
        ...values,
        options: values.options ? values.options.split('\n').filter((opt: string) => opt.trim()) : undefined,
        profileWeight: {
          pelvico: parseFloat(values.pelvico) || 0,
          intestinal: parseFloat(values.intestinal) || 0,
          urinario: parseFloat(values.urinario) || 0,
          emocional: parseFloat(values.emocional) || 0,
        }
      };

      if (editingQuestion) {
        const updatedQuestions = questions.map(q =>
          q.id === editingQuestion.id
            ? { ...q, ...questionData, lastModified: new Date().toISOString().split('T')[0] }
            : q
        );
        setQuestions(updatedQuestions);
        message.success('Pergunta atualizada com sucesso');
      } else {
        const newQuestion: ScreeningQuestion = {
          id: `Q${(questions.length + 1).toString().padStart(3, '0')}`,
          ...questionData,
          createdAt: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0],
        };
        setQuestions([...questions, newQuestion]);
        message.success('Pergunta criada com sucesso');
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao salvar pergunta');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dor_pelvica': return '🩸';
      case 'sintomas_intestinais': return '🦠';
      case 'sintomas_urinarios': return '💧';
      case 'aspecto_emocional': return '🧠';
      case 'historico_familiar': return '👥';
      default: return '❓';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dor_pelvica': return '#5D3FD3';
      case 'sintomas_intestinais': return '#A6B1E1';
      case 'sintomas_urinarios': return '#F76C6C';
      case 'aspecto_emocional': return '#52c41a';
      case 'historico_familiar': return '#faad14';
      default: return '#d9d9d9';
    }
  };

  const questionColumns: ColumnsType<ScreeningQuestion> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: string) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: 'Pergunta',
      dataIndex: 'questionText',
      key: 'questionText',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>
          {getCategoryIcon(category)} {category.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'questionType',
      key: 'questionType',
      render: (type: string) => {
        const typeMap = {
          'multiple_choice': 'Múltipla Escolha',
          'scale': 'Escala',
          'yes_no': 'Sim/Não',
          'text': 'Texto'
        };
        return typeMap[type as keyof typeof typeMap] || type;
      },
    },
    {
      title: 'Ordem',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: 'Obrigatória',
      dataIndex: 'isRequired',
      key: 'isRequired',
      render: (required: boolean) => (
        <Tag color={required ? 'red' : 'default'}>
          {required ? 'Sim' : 'Não'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'default'}>
          {active ? 'Ativa' : 'Inativa'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => {}}>
            Ver
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditQuestion(record)}>
            Editar
          </Button>
          <Button size="small" icon={<CopyOutlined />} onClick={() => {}}>
            Duplicar
          </Button>
          <Popconfirm
            title="Remover pergunta?"
            description="Esta ação não pode ser desfeita."
            onConfirm={() => handleDeleteQuestion(record.id)}
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

  const activeQuestions = questions.filter(q => q.isActive).length;
  const totalQuestions = questions.length;
  const avgCompletionRate = flows.reduce((acc, flow) => acc + flow.completionRate, 0) / flows.length;

  return (
    <div style={{ padding: '0 8px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8, color: '#5D3FD3' }}>
          <QuestionOutlined /> Gestão de Perguntas de Triagem - EndoConnect
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Sistema de gestão das perguntas da triagem digital de sintomas de endometriose
        </p>
      </div>

      <Alert
        message="📋 Triagem Digital Funcional"
        description="Sistema de perguntas baseado na lógica condicional do fluxo de triagem validado com 94% de feedback positivo."
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total de Perguntas"
              value={totalQuestions}
              prefix={<QuestionOutlined />}
              valueStyle={{ color: '#5D3FD3' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Perguntas Ativas"
              value={activeQuestions}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Taxa de Conclusão Média"
              value={avgCompletionRate}
              precision={1}
              suffix="%"
              prefix={<BranchesOutlined />}
              valueStyle={{ color: '#A6B1E1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Respostas Coletadas"
              value={312}
              prefix={<OrderedListOutlined />}
              valueStyle={{ color: '#F76C6C' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs 
        defaultActiveKey="questions"
        items={[
          {
            key: 'questions',
            label: '📝 Perguntas de Triagem',
            children: (
              <Card 
                title="Lista de Perguntas" 
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuestion}>
                    Nova Pergunta
                  </Button>
                }
              >
                <Table
                  columns={questionColumns}
                  dataSource={questions}
                  loading={loading}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} perguntas`,
                  }}
                  scroll={{ x: 1200 }}
                />
              </Card>
            )
          },
          {
            key: 'flows',
            label: '🔄 Fluxos de Triagem',
            children: (
              <Card title="Fluxos de Triagem Configurados">
                <Row gutter={[16, 16]}>
                  {flows.map(flow => (
                    <Col xs={24} md={12} lg={8} key={flow.id}>
                      <Card size="small" style={{ borderColor: flow.isActive ? '#52c41a' : '#d9d9d9' }}>
                        <div style={{ marginBottom: 8 }}>
                          <h4 style={{ margin: 0 }}>{flow.name}</h4>
                          <Tag color={flow.isActive ? 'green' : 'default'}>
                            {flow.isActive ? 'Ativo' : 'Inativo'}
                          </Tag>
                        </div>
                        <p><strong>Versão:</strong> {flow.version}</p>
                        <p><strong>Perguntas:</strong> {flow.questions.length}</p>
                        <p><strong>Respostas:</strong> {flow.totalResponses}</p>
                        <p><strong>Taxa de Conclusão:</strong> {flow.completionRate}%</p>
                        <p><strong>Tempo Médio:</strong> {flow.avgTimeToComplete}</p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            )
          }
        ]}
      />

      {/* Question Form Modal */}
      <Modal
        title={editingQuestion ? '✏️ Editar Pergunta' : '➕ Nova Pergunta'}
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
          onFinish={handleSubmitQuestion}
          layout="vertical"
        >
          <Form.Item
            name="questionText"
            label="Texto da Pergunta"
            rules={[{ required: true, message: 'Digite o texto da pergunta' }]}
          >
            <TextArea rows={3} placeholder="Digite a pergunta que será exibida para a usuária" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Categoria"
                rules={[{ required: true, message: 'Selecione uma categoria' }]}
              >
                <Select placeholder="Selecione a categoria">
                  <Option value="dor_pelvica">🩸 Dor Pélvica</Option>
                  <Option value="sintomas_intestinais">🦠 Sintomas Intestinais</Option>
                  <Option value="sintomas_urinarios">💧 Sintomas Urinários</Option>
                  <Option value="aspecto_emocional">🧠 Aspecto Emocional</Option>
                  <Option value="historico_familiar">👥 Histórico Familiar</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="questionType"
                label="Tipo de Pergunta"
                rules={[{ required: true, message: 'Selecione o tipo' }]}
              >
                <Select placeholder="Selecione o tipo">
                  <Option value="multiple_choice">Múltipla Escolha</Option>
                  <Option value="scale">Escala (0-5)</Option>
                  <Option value="yes_no">Sim/Não</Option>
                  <Option value="text">Texto Livre</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="options"
            label="Opções de Resposta (uma por linha)"
            tooltip="Digite cada opção em uma linha separada. Necessário apenas para múltipla escolha e escala."
          >
            <TextArea rows={4} placeholder="Opção 1&#10;Opção 2&#10;Opção 3" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="order" label="Ordem" rules={[{ required: true }]}>
                <Input type="number" placeholder="1" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="isRequired" label="Obrigatória" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="isActive" label="Ativa" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Peso para Perfis Sintomáticos</Divider>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="pelvico" label="Pélvico" initialValue={0}>
                <Input type="number" step="0.1" min="0" max="1" placeholder="0.0" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="intestinal" label="Intestinal" initialValue={0}>
                <Input type="number" step="0.1" min="0" max="1" placeholder="0.0" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="urinario" label="Urinário" initialValue={0}>
                <Input type="number" step="0.1" min="0" max="1" placeholder="0.0" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="emocional" label="Emocional" initialValue={0}>
                <Input type="number" step="0.1" min="0" max="1" placeholder="0.0" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="conditionLogic" label="Lógica Condicional (opcional)">
            <Input placeholder="Ex: Q001 != 'Raramente'" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 