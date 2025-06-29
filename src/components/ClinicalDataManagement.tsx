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

  message,
  Row,
  Col,
  Statistic,
  Tabs,
  Progress,
  Alert,
  Rate,
} from 'antd';
import {
  CommentOutlined,
  UserOutlined,
  HeartOutlined,
  BarChartOutlined,
  EyeOutlined,
  DownloadOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;

interface FeedbackRecord {
  id: string;
  userId: string;
  userProfile: 'pelvico' | 'intestinal' | 'urinario' | 'emocional' | 'misto';
  feedbackType: 'triagem' | 'modulo_educativo' | 'grupo_apoio' | 'geral';
  category: string;
  rating: number;
  comment: string;
  sentiment: 'positivo' | 'neutro' | 'negativo';
  isAnonymous: boolean;
  submittedAt: string;
  responded: boolean;
  responseBy?: string;
  responseAt?: string;
  tags: string[];
  region: string;
}

interface EngagementData {
  userId: string;
  totalSessions: number;
  avgSessionDuration: string;
  modulesCompleted: number;
  triagensCompleted: number;
  groupParticipation: number;
  lastActivity: string;
  engagementScore: number;
  riskLevel: 'baixo' | 'medio' | 'alto';
}

interface DataStats {
  totalFeedbacks: number;
  positiveRate: number;
  avgRating: number;
  responseRate: number;
  totalUsers: number;
  activeUsers: number;
}

export default function FeedbackDataManagement() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [loading, setLoading] = useState(false);
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRecord | null>(null);
  const [responseForm] = Form.useForm();
  const [stats, setStats] = useState<DataStats>({
    totalFeedbacks: 0,
    positiveRate: 0,
    avgRating: 0,
    responseRate: 0,
    totalUsers: 0,
    activeUsers: 0
  });

  // Mock data for EndoConnect feedback and engagement
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockFeedbacks: FeedbackRecord[] = [
        {
          id: 'FB-001',
          userId: 'ANON-8547',
          userProfile: 'pelvico',
          feedbackType: 'triagem',
          category: 'Experiência de Triagem',
          rating: 5,
          comment: 'O questionário foi muito claro e me ajudou a entender melhor meus sintomas.',
          sentiment: 'positivo',
          isAnonymous: true,
          submittedAt: '2024-02-15 14:30',
          responded: true,
          responseBy: 'Equipe Médica',
          responseAt: '2024-02-15 16:45',
          tags: ['triagem', 'sintomas', 'clareza'],
          region: 'São Paulo'
    },
    {
          id: 'FB-002',
          userId: 'ANON-3921',
          userProfile: 'intestinal',
          feedbackType: 'modulo_educativo',
          category: 'Módulo: Sintomas Intestinais',
          rating: 4,
          comment: 'Conteúdo muito informativo, mas poderia ter mais exemplos práticos.',
          sentiment: 'positivo',
          isAnonymous: true,
          submittedAt: '2024-02-14 09:15',
          responded: false,
          tags: ['educativo', 'conteudo', 'pratico'],
          region: 'Rio de Janeiro'
        },
        {
          id: 'FB-003',
          userId: 'ANON-1632',
          userProfile: 'emocional',
          feedbackType: 'grupo_apoio',
          category: 'Grupo de Apoio Digital',
          rating: 5,
          comment: 'Me senti muito acolhida no grupo. As outras mulheres entenderam exatamente o que eu estava passando.',
          sentiment: 'positivo',
          isAnonymous: true,
          submittedAt: '2024-02-13 20:22',
          responded: true,
          responseBy: 'Psicóloga',
          responseAt: '2024-02-14 08:30',
          tags: ['apoio', 'acolhimento', 'comunidade'],
          region: 'Belo Horizonte'
        },
        {
          id: 'FB-004',
          userId: 'ANON-7834',
          userProfile: 'urinario',
          feedbackType: 'geral',
          category: 'Plataforma Geral',
          rating: 3,
          comment: 'A plataforma é boa, mas às vezes fica lenta para carregar.',
          sentiment: 'neutro',
          isAnonymous: true,
          submittedAt: '2024-02-12 16:45',
          responded: false,
          tags: ['performance', 'tecnico', 'carregamento'],
          region: 'Brasília'
        },
        {
          id: 'FB-005',
          userId: 'ANON-5647',
          userProfile: 'misto',
          feedbackType: 'triagem',
          category: 'Resultado da Triagem',
          rating: 2,
          comment: 'Achei o resultado muito genérico, esperava orientações mais específicas.',
          sentiment: 'negativo',
          isAnonymous: true,
          submittedAt: '2024-02-11 11:20',
          responded: true,
          responseBy: 'Dr. Santos',
          responseAt: '2024-02-12 10:15',
          tags: ['resultado', 'personalizacao', 'orientacao'],  
          region: 'Salvador'
        }
      ];

      const mockEngagement: EngagementData[] = [
        {
          userId: 'ANON-8547',
          totalSessions: 12,
          avgSessionDuration: '8m 34s',
          modulesCompleted: 3,
          triagensCompleted: 1,
          groupParticipation: 85,
          lastActivity: '2024-02-15',
          engagementScore: 92,
          riskLevel: 'baixo'
    },
    {
          userId: 'ANON-3921',
          totalSessions: 8,
          avgSessionDuration: '6m 12s',
          modulesCompleted: 2,
          triagensCompleted: 1,
          groupParticipation: 45,
          lastActivity: '2024-02-14',
          engagementScore: 73,
          riskLevel: 'medio'
        }
      ];

      setFeedbacks(mockFeedbacks);
      setEngagementData(mockEngagement);
      
      // Calculate stats
      const positiveCount = mockFeedbacks.filter(f => f.sentiment === 'positivo').length;
      const totalRating = mockFeedbacks.reduce((acc, f) => acc + f.rating, 0);
      const respondedCount = mockFeedbacks.filter(f => f.responded).length;
      
      setStats({
        totalFeedbacks: mockFeedbacks.length,
        positiveRate: (positiveCount / mockFeedbacks.length) * 100,
        avgRating: totalRating / mockFeedbacks.length,
        responseRate: (respondedCount / mockFeedbacks.length) * 100,
        totalUsers: 156,
        activeUsers: 98
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleResponseFeedback = (feedback: FeedbackRecord) => {
    setSelectedFeedback(feedback);
    responseForm.resetFields();
    setResponseModalVisible(true);
  };

  const handleSubmitResponse = async () => {
    try {
      if (selectedFeedback) {
        const updatedFeedbacks = feedbacks.map(f =>
          f.id === selectedFeedback.id
            ? { 
                ...f, 
                responded: true,
                responseBy: 'Admin User',
                responseAt: new Date().toLocaleString('pt-BR')
              }
            : f
        );
        setFeedbacks(updatedFeedbacks);
        message.success('Resposta enviada com sucesso');
        setResponseModalVisible(false);
      }
    } catch {
      message.error('Erro ao enviar resposta');
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo': return 'green';
      case 'neutro': return 'orange';
      case 'negativo': return 'red';
      default: return 'default';
    }
  };

  const getProfileIcon = (profile: string) => {
    switch (profile) {
      case 'pelvico': return '🩸';
      case 'intestinal': return '🦠';
      case 'urinario': return '💧';
      case 'emocional': return '🧠';
      case 'misto': return '🧩';
      default: return '❓';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'baixo': return 'green';
      case 'medio': return 'orange';
      case 'alto': return 'red';
      default: return 'default';
    }
  };

  const feedbackColumns: ColumnsType<FeedbackRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: string) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: 'Usuária',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string, record) => (
        <Space direction="vertical" size="small">
          <Tag color="#5D3FD3">{userId}</Tag>
          <Tag color="#A6B1E1">
            {getProfileIcon(record.userProfile)} {record.userProfile}
        </Tag>
        </Space>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'feedbackType',
      key: 'feedbackType',
      render: (type: string) => {
        const typeMap = {
          'triagem': '🩺 Triagem',
          'modulo_educativo': '📚 Módulo',
          'grupo_apoio': '👥 Grupo',
          'geral': '🌐 Geral'
        };
        return <Tag>{typeMap[type as keyof typeof typeMap] || type}</Tag>;
      },
    },
    {
      title: 'Avaliação',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Sentimento',
      dataIndex: 'sentiment',
      key: 'sentiment',
      render: (sentiment: string) => (
        <Tag color={getSentimentColor(sentiment)}>
          {sentiment.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Comentário',
      dataIndex: 'comment',
      key: 'comment',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Data',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      sorter: (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'responded',
      key: 'responded',
      render: (responded: boolean) => (
        <Tag color={responded ? 'green' : 'orange'}>
          {responded ? '✅ Respondido' : '⏳ Pendente'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>
            Ver
          </Button>
          {!record.responded && (
          <Button
              size="small" 
            type="primary"
              icon={<MessageOutlined />}
              onClick={() => handleResponseFeedback(record)}
          >
              Responder
            </Button>
          )}
          <Button size="small" icon={<DownloadOutlined />}>
            Exportar
          </Button>
        </Space>
      ),
    },
  ];

  const engagementColumns: ColumnsType<EngagementData> = [
    {
      title: 'Usuária',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => <Tag color="#5D3FD3">{userId}</Tag>,
    },
    {
      title: 'Sessões',
      dataIndex: 'totalSessions',
      key: 'totalSessions',
      sorter: (a, b) => a.totalSessions - b.totalSessions,
    },
    {
      title: 'Duração Média',
      dataIndex: 'avgSessionDuration',
      key: 'avgSessionDuration',
    },
    {
      title: 'Módulos',
      dataIndex: 'modulesCompleted',
      key: 'modulesCompleted',
      sorter: (a, b) => a.modulesCompleted - b.modulesCompleted,
    },
    {
      title: 'Participação Grupo',
      dataIndex: 'groupParticipation',
      key: 'groupParticipation',
      render: (participation: number) => (
        <Progress percent={participation} size="small" />
      ),
    },
    {
      title: 'Score Engajamento',
      dataIndex: 'engagementScore',
      key: 'engagementScore',
      render: (score: number) => (
        <Tag color={score > 80 ? 'green' : score > 60 ? 'orange' : 'red'}>
          {score}
        </Tag>
      ),
      sorter: (a, b) => a.engagementScore - b.engagementScore,
    },
    {
      title: 'Nível de Risco',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (risk: string) => (
        <Tag color={getRiskColor(risk)}>
          {risk.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Última Atividade',  
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      sorter: (a, b) => new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime(),
    },
  ];

  return (
    <div style={{ padding: '0 8px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8, color: '#5D3FD3' }}>
          <BarChartOutlined /> Gestão de Feedback & Dados - EndoConnect
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Monitore feedback das usuárias e dados de engajamento da plataforma
        </p>
      </div>

      <Alert
        message="📊 Sistema de Feedback Ativo"
        description="Coleta contínua de feedback das usuárias com análise de sentimento e acompanhamento de engajamento."
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total de Feedbacks"
              value={stats.totalFeedbacks}
              prefix={<CommentOutlined />}
              valueStyle={{ color: '#5D3FD3' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Taxa Positiva"
              value={stats.positiveRate}
              precision={1}
              suffix="%"
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Avaliação Média"
              value={stats.avgRating}
              precision={1}
              suffix="/5"
              prefix={<StarOutlined />}
              valueStyle={{ color: '#A6B1E1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Taxa de Resposta"
              value={stats.responseRate}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#F76C6C' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs 
        defaultActiveKey="feedbacks"
        items={[
          {
            key: 'feedbacks',
            label: '💬 Feedbacks das Usuárias',
            children: (
              <Card title="Feedbacks Recebidos">
                <Table
                  columns={feedbackColumns}
                  dataSource={feedbacks}
                  loading={loading}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} feedbacks`,
                  }}
                  scroll={{ x: 1200 }}
                />
              </Card>
            )
          },
          {
            key: 'engagement',
            label: '📈 Dados de Engajamento',
            children: (
              <Card title="Engajamento das Usuárias">
                <Table
                  columns={engagementColumns}
                  dataSource={engagementData}
                  loading={loading}
                  rowKey="userId"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} usuárias`,
                  }}
                  scroll={{ x: 1000 }}
                />
              </Card>
            )
          },
          {
            key: 'reports',
            label: '📊 Relatórios',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="Usuárias Ativas">
                    <Statistic
                      title="Usuárias Ativas (últimos 30 dias)"
                      value={stats.activeUsers}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#5D3FD3' }}
                    />
                    <Progress 
                      percent={(stats.activeUsers / stats.totalUsers) * 100} 
                      strokeColor="#5D3FD3"
                      style={{ marginTop: 16 }}
                    />
                    <p style={{ marginTop: 8, color: '#666' }}>
                      {stats.activeUsers} de {stats.totalUsers} usuárias ativas
                    </p>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Distribuição por Região">
                    <div style={{ padding: 16 }}>
                      <p>🔵 São Paulo: 35%</p>
                      <p>🟢 Rio de Janeiro: 22%</p>
                      <p>🟡 Belo Horizonte: 18%</p>
                      <p>🟠 Brasília: 15%</p>
                      <p>🔴 Salvador: 10%</p>
                    </div>
                  </Card>
                </Col>
              </Row>
            )
          }
        ]}
      />

      {/* Response Modal */}
      <Modal
        title="💬 Responder Feedback"
        open={responseModalVisible}
        onCancel={() => setResponseModalVisible(false)}
        onOk={() => responseForm.submit()}
        width={600}
        destroyOnHidden
      >
        {selectedFeedback && (
          <div style={{ marginBottom: 16 }}>
            <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
              <p><strong>Usuária:</strong> {selectedFeedback.userId}</p>
              <p><strong>Avaliação:</strong> <Rate disabled defaultValue={selectedFeedback.rating} /></p>
              <p><strong>Comentário:</strong> {selectedFeedback.comment}</p>
            </Card>
          </div>
        )}
        
        <Form
          form={responseForm}
          onFinish={handleSubmitResponse}
          layout="vertical"
        >
          <Form.Item
            name="response"
            label="Sua Resposta"
            rules={[{ required: true, message: 'Digite uma resposta' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Digite uma resposta personalizada para a usuária..."
            />
          </Form.Item>

          <Form.Item
            name="followUp"
            label="Ação de Acompanhamento"
          >
            <Select placeholder="Selecione uma ação (opcional)">
              <Option value="call">Ligar para a usuária</Option>
              <Option value="email">Enviar email de acompanhamento</Option>
              <Option value="survey">Enviar pesquisa de satisfação</Option>
              <Option value="none">Nenhuma ação adicional</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 