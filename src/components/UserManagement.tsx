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
  DatePicker,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  HeartOutlined,
  ExperimentOutlined,
  WarningOutlined,
  AlertOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SafetyOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TabPane } = Tabs;

interface EndoUser {
  id: string;
  anonymousId: string;
  age: number;
  symptomaticProfile: 'pelvico' | 'intestinal' | 'urinario' | 'emocional' | 'misto';
  riskLevel: 'baixo' | 'medio' | 'alto';
  engagementScore: number;
  triageCompleted: boolean;
  consentStatus: 'ativo' | 'revogado' | 'pendente';
  lastActivity: string;
  modulesCompleted: number;
  totalModules: number;
  supportGroupParticipation: boolean;
  city: string;
  state: string;
  joinDate: string;
  status: 'ativa' | 'inativa' | 'em_risco';
}

interface ConsentRecord {
  id: string;
  userId: string;
  version: string;
  acceptedAt: string;
  revokedAt?: string;
  status: 'ativo' | 'revogado';
  ipAddress: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<EndoUser[]>([]);
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [consentModalVisible, setConsentModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<EndoUser | null>(null);
  const [form] = Form.useForm();

  // Mock data for EndoConnect users
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockUsers: EndoUser[] = [
        {
          id: 'USR-001',
          anonymousId: 'ANON-7F2A3E',
          age: 28,
          symptomaticProfile: 'pelvico',
          riskLevel: 'alto',
          engagementScore: 45,
          triageCompleted: true,
          consentStatus: 'ativo',
          lastActivity: '2h atrás',
          modulesCompleted: 2,
          totalModules: 6,
          supportGroupParticipation: false,
          city: 'São Paulo',
          state: 'SP',
          joinDate: '2024-01-15',
          status: 'em_risco'
        },
        {
          id: 'USR-023',
          anonymousId: 'ANON-9B4C1D',
          age: 32,
          symptomaticProfile: 'misto',
          riskLevel: 'medio',
          engagementScore: 68,
          triageCompleted: true,
          consentStatus: 'ativo',
          lastActivity: '1 dia',
          modulesCompleted: 4,
          totalModules: 6,
          supportGroupParticipation: true,
          city: 'Rio de Janeiro',
          state: 'RJ',
          joinDate: '2024-01-20',
          status: 'ativa'
        },
        {
          id: 'USR-045',
          anonymousId: 'ANON-3E8F5A',
          age: 25,
          symptomaticProfile: 'intestinal',
          riskLevel: 'baixo',
          engagementScore: 85,
          triageCompleted: true,
          consentStatus: 'ativo',
          lastActivity: '3h atrás',
          modulesCompleted: 5,
          totalModules: 6,
          supportGroupParticipation: true,
          city: 'Belo Horizonte',
          state: 'MG',
          joinDate: '2024-01-25',
          status: 'ativa'
        },
        {
          id: 'USR-067',
          anonymousId: 'ANON-6D2B9C',
          age: 30,
          symptomaticProfile: 'emocional',
          riskLevel: 'alto',
          engagementScore: 32,
          triageCompleted: false,
          consentStatus: 'ativo',
          lastActivity: '5 dias',
          modulesCompleted: 1,
          totalModules: 6,
          supportGroupParticipation: false,
          city: 'Fortaleza',
          state: 'CE',
          joinDate: '2024-02-01',
          status: 'em_risco'
        },
        {
          id: 'USR-089',
          anonymousId: 'ANON-4A7E2F',
          age: 27,
          symptomaticProfile: 'urinario',
          riskLevel: 'medio',
          engagementScore: 71,
          triageCompleted: true,
          consentStatus: 'ativo',
          lastActivity: '12h atrás',
          modulesCompleted: 3,
          totalModules: 6,
          supportGroupParticipation: true,
          city: 'Porto Alegre',
          state: 'RS',
          joinDate: '2024-02-05',
          status: 'ativa'
        }
      ];

      const mockConsents: ConsentRecord[] = mockUsers.map(user => ({
        id: `CONSENT-${user.id}`,
        userId: user.id,
        version: '1.0',
        acceptedAt: user.joinDate,
        status: user.consentStatus === 'pendente' ? 'ativo' : user.consentStatus,
        ipAddress: '192.168.1.***'
      }));

      setUsers(mockUsers);
      setConsents(mockConsents);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetails = (user: EndoUser) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleViewConsent = (user: EndoUser) => {
    setSelectedUser(user);
    setConsentModalVisible(true);
  };

  const handleRevokeConsent = async (userId: string) => {
    try {
      const updatedUsers = users.map(user =>
        user.id === userId
          ? { ...user, consentStatus: 'revogado' as const, status: 'inativa' as const }
          : user
      );
      setUsers(updatedUsers);
      message.success('Consentimento revogado com sucesso');
    } catch (error) {
      message.error('Erro ao revogar consentimento');
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

  const getProfileColor = (profile: string) => {
    switch (profile) {
      case 'pelvico': return '#5D3FD3';
      case 'intestinal': return '#A6B1E1';
      case 'urinario': return '#F76C6C';
      case 'emocional': return '#52c41a';
      case 'misto': return '#faad14';
      default: return '#d9d9d9';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'alto': return '#f5222d';
      case 'medio': return '#faad14';
      case 'baixo': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return '#52c41a';
      case 'inativa': return '#d9d9d9';
      case 'em_risco': return '#f5222d';
      default: return '#d9d9d9';
    }
  };

  const userColumns: ColumnsType<EndoUser> = [
    {
      title: 'ID Anônimo',
      dataIndex: 'anonymousId',
      key: 'anonymousId',
      render: (id: string) => (
        <Tag color="blue">{id}</Tag>
      ),
    },
    {
      title: 'Perfil Sintomático',
      dataIndex: 'symptomaticProfile',
      key: 'symptomaticProfile',
      render: (profile: string) => (
        <Tag color={getProfileColor(profile)}>
          {getProfileIcon(profile)} {profile.charAt(0).toUpperCase() + profile.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Idade',
      dataIndex: 'age',
      key: 'age',
      render: (age: number) => `${age} anos`,
    },
    {
      title: 'Localização',
      key: 'location',
      render: (_, record) => `${record.city}, ${record.state}`,
    },
    {
      title: 'Risco Psicossocial',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (risk: string) => (
        <Tag color={getRiskColor(risk)}>
          {risk.charAt(0).toUpperCase() + risk.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Engajamento',
      dataIndex: 'engagementScore',
      key: 'engagementScore',
      render: (score: number) => (
        <div style={{ width: 80 }}>
          <span>{score}%</span>
          <div style={{
            width: '100%',
            height: 4,
            backgroundColor: '#f0f0f0',
            borderRadius: 2,
            marginTop: 4
          }}>
            <div style={{
              width: `${score}%`,
              height: '100%',
              backgroundColor: score < 50 ? '#f5222d' : score < 70 ? '#faad14' : '#52c41a',
              borderRadius: 2
            }} />
          </div>
        </div>
      ),
    },
    {
      title: 'Progresso',
      key: 'progress',
      render: (_, record) => (
        <span>{record.modulesCompleted}/{record.totalModules} módulos</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          color={getStatusColor(status)} 
          text={status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')} 
        />
      ),
    },
    {
      title: 'Última Atividade',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            Detalhes
          </Button>
          <Button size="small" icon={<SafetyOutlined />} onClick={() => handleViewConsent(record)}>
            Consentimento
          </Button>
          {record.status === 'em_risco' && (
            <Button size="small" type="primary" danger icon={<WarningOutlined />}>
              Intervenção
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const activeUsers = users.filter(u => u.status === 'ativa').length;
  const riskUsers = users.filter(u => u.status === 'em_risco').length;
  const avgEngagement = users.reduce((acc, u) => acc + u.engagementScore, 0) / users.length;
  const triageCompletion = (users.filter(u => u.triageCompleted).length / users.length) * 100;

  return (
    <div style={{ padding: '0 8px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8, color: '#5D3FD3' }}>
          <UserOutlined /> Gestão de Usuárias - EndoConnect
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Monitoramento e gestão das usuárias da plataforma EndoConnect com foco em privacidade e anonimização
        </p>
      </div>

      {riskUsers > 0 && (
        <Alert
          message={`⚠️ ${riskUsers} usuárias em situação de risco identificadas`}
          description="Usuárias com baixo engajamento ou indicadores de risco emocional necessitam acompanhamento."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary" danger>
              Ver Casos Urgentes
            </Button>
          }
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
              <Card>
                <Statistic
              title="Usuárias Ativas"
              value={activeUsers}
                  prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
        <Col xs={12} sm={6}>
              <Card>
                <Statistic
              title="Em Risco"
              value={riskUsers}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
        <Col xs={12} sm={6}>
              <Card>
                <Statistic
              title="Engajamento Médio"
              value={avgEngagement}
              precision={1}
              suffix="%"
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#5D3FD3' }}
                />
              </Card>
            </Col>
        <Col xs={12} sm={6}>
              <Card>
                <Statistic
              title="Triagem Completa"
              value={triageCompletion}
              precision={1}
              suffix="%"
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#A6B1E1' }}
                />
              </Card>
            </Col>
          </Row>

      <Card title="👥 Lista de Usuárias">
        <Table
          columns={userColumns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} usuárias`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* User Details Modal */}
      <Modal
        title="📋 Detalhes da Usuária"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedUser && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p><strong>ID Anônimo:</strong> {selectedUser.anonymousId}</p>
                <p><strong>Idade:</strong> {selectedUser.age} anos</p>
                <p><strong>Localização:</strong> {selectedUser.city}, {selectedUser.state}</p>
                <p><strong>Data de Cadastro:</strong> {selectedUser.joinDate}</p>
              </Col>
              <Col span={12}>
                <p><strong>Perfil Sintomático:</strong> 
                  <Tag color={getProfileColor(selectedUser.symptomaticProfile)} style={{ marginLeft: 8 }}>
                    {getProfileIcon(selectedUser.symptomaticProfile)} {selectedUser.symptomaticProfile}
                  </Tag>
                </p>
                <p><strong>Risco Psicossocial:</strong> 
                  <Tag color={getRiskColor(selectedUser.riskLevel)} style={{ marginLeft: 8 }}>
                    {selectedUser.riskLevel}
                  </Tag>
                </p>
                <p><strong>Score de Engajamento:</strong> {selectedUser.engagementScore}%</p>
                <p><strong>Módulos Concluídos:</strong> {selectedUser.modulesCompleted}/{selectedUser.totalModules}</p>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
                <p><strong>Triagem Completa:</strong> {selectedUser.triageCompleted ? 'Sim' : 'Não'}</p>
                <p><strong>Participa de Grupos:</strong> {selectedUser.supportGroupParticipation ? 'Sim' : 'Não'}</p>
            </Col>
            <Col span={12}>
                <p><strong>Status do Consentimento:</strong> 
                  <Tag color={selectedUser.consentStatus === 'ativo' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                    {selectedUser.consentStatus}
                  </Tag>
                </p>
                <p><strong>Última Atividade:</strong> {selectedUser.lastActivity}</p>
            </Col>
          </Row>
          </div>
        )}
      </Modal>

      {/* Consent Management Modal */}
      <Modal
        title="🔐 Gestão de Consentimento LGPD"
        open={consentModalVisible}
        onCancel={() => setConsentModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setConsentModalVisible(false)}>
            Fechar
          </Button>,
          selectedUser?.consentStatus === 'ativo' && (
            <Popconfirm
              key="revoke"
              title="Revogar consentimento?"
              description="Esta ação irá revogar o consentimento da usuária e desativar sua conta."
              onConfirm={() => selectedUser && handleRevokeConsent(selectedUser.id)}
              okText="Sim, revogar"
              cancelText="Cancelar"
            >
              <Button type="primary" danger>
                Revogar Consentimento
              </Button>
            </Popconfirm>
          )
        ]}
          >
        {selectedUser && (
          <div>
            <p><strong>ID da Usuária:</strong> {selectedUser.anonymousId}</p>
            <p><strong>Status:</strong> 
              <Tag color={selectedUser.consentStatus === 'ativo' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                {selectedUser.consentStatus}
              </Tag>
            </p>
            <p><strong>Versão do Termo:</strong> 1.0</p>
            <p><strong>Data de Aceite:</strong> {selectedUser.joinDate}</p>
            <p><strong>Conformidade LGPD:</strong> <Tag color="green">✓ Ativo</Tag></p>
            
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f6ffed', borderRadius: 8 }}>
              <h4>Direitos da Usuária (LGPD)</h4>
              <ul>
                <li>Acessar dados coletados</li>
                <li>Solicitar correção de dados</li>
                <li>Solicitar exclusão de dados</li>
                <li>Revogar consentimento a qualquer momento</li>
                <li>Portabilidade de dados</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 