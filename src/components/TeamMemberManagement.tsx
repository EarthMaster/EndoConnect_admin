'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Space,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Badge,
  Alert,
  Avatar,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  ExperimentOutlined,
  SettingOutlined,
  WarningOutlined,
  EyeOutlined,
  SafetyOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'coordenador' | 'pesquisador' | 'desenvolvedor' | 'analista';
  department: string;
  permissions: string[];
  status: 'ativo' | 'inativo' | 'pendente';
  joinDate: string;
  lastLogin: string;
  specialty: string;
  projectsAssigned: number;
  accessLevel: 'admin' | 'moderador' | 'usuario';
  lastActive: string;
}

export default function TeamMemberManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Mock data for team members
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockTeamMembers: TeamMember[] = [
        {
          id: 'TM-001',
          name: 'Dr. Maria Silva',
          email: 'maria.silva@endoconnect.com',
          phone: '+55 11 99999-1234',
          role: 'coordenador',
          department: 'Coordenação Técnica',
          permissions: ['user_management', 'data_analysis', 'team_management', 'system_config'],
          status: 'ativo',
          joinDate: '2023-01-15',
          lastLogin: '2h atrás',
          specialty: 'Ginecologia',
          projectsAssigned: 3,
          accessLevel: 'admin',
          lastActive: '2h atrás'
        },
        {
          id: 'TM-002',
          name: 'Dr. João Santos',
          email: 'joao.santos@endoconnect.com',
          phone: '+55 21 99999-5678',
          role: 'pesquisador',
          department: 'Pesquisa Clínica',
          permissions: ['data_analysis', 'screening_questions', 'educational_modules'],
          status: 'ativo',
          joinDate: '2023-02-01',
          lastLogin: '1 dia',
          specialty: 'Endocrinologia',
          projectsAssigned: 2,
          accessLevel: 'moderador',
          lastActive: '1 dia'
        },
        {
          id: 'TM-003',
          name: 'Ana Costa',
          email: 'ana.costa@endoconnect.com',
          phone: '+55 31 99999-9012',
          role: 'desenvolvedor',
          department: 'Tecnologia',
          permissions: ['system_config', 'user_management', 'data_export'],
          status: 'ativo',
          joinDate: '2023-03-10',
          lastLogin: '30min atrás',
          specialty: 'Full Stack',
          projectsAssigned: 5,
          accessLevel: 'admin',
          lastActive: '30min atrás'
        },
        {
          id: 'TM-004',
          name: 'Carlos Oliveira',
          email: 'carlos.oliveira@endoconnect.com',
          phone: '+55 85 99999-3456',
          role: 'analista',
          department: 'Análise de Dados',
          permissions: ['data_analysis', 'feedback_data'],
          status: 'ativo',
          joinDate: '2023-04-05',
          lastLogin: '3h atrás',
          specialty: 'Estatística',
          projectsAssigned: 1,
          accessLevel: 'usuario',
          lastActive: '3h atrás'
        },
        {
          id: 'TM-005',
          name: 'Dra. Fernanda Lima',
          email: 'fernanda.lima@endoconnect.com',
          phone: '+55 47 99999-7890',
          role: 'pesquisador',
          department: 'Pesquisa Clínica',
          permissions: ['screening_questions', 'educational_modules'],
          status: 'pendente',
          joinDate: '2024-01-20',
          lastLogin: 'Nunca',
          specialty: 'Psicologia',
          projectsAssigned: 0,
          accessLevel: 'usuario',
          lastActive: 'Nunca'
        }
      ];

      setTeamMembers(mockTeamMembers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setModalVisible(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'coordenador':
        return '👑';
      case 'pesquisador':
        return '🔬';
      case 'desenvolvedor':
        return '💻';
      case 'analista':
        return '📊';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'coordenador':
        return '#722ed1';
      case 'pesquisador':
        return '#1890ff';
      case 'desenvolvedor':
        return '#52c41a';
      case 'analista':
        return '#fa8c16';
      default:
        return '#8c8c8c';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return '#52c41a';
      case 'inativo':
        return '#d9d9d9';
      case 'pendente':
        return '#faad14';
      default:
        return '#d9d9d9';
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'admin':
        return '#f5222d';
      case 'moderador':
        return '#faad14';
      case 'usuario':
        return '#52c41a';
      default:
        return '#d9d9d9';
    }
  };

  const teamColumns: ColumnsType<TeamMember> = [
    {
      title: 'Membro',
      key: 'member',
      render: (_, record) => (
        <Space>
          <Avatar 
            style={{ backgroundColor: getRoleColor(record.role) }} 
            icon={<UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Função',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>
          {getRoleIcon(role)} {role.charAt(0).toUpperCase() + role.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Departamento',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Especialidade',
      dataIndex: 'specialty',
      key: 'specialty',
    },
    {
      title: 'Nível de Acesso',
      dataIndex: 'accessLevel',
      key: 'accessLevel',
      render: (level: string) => (
        <Tag color={getAccessLevelColor(level)}>
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Projetos',
      dataIndex: 'projectsAssigned',
      key: 'projectsAssigned',
      render: (count: number) => (
        <div style={{ textAlign: 'center' }}>
          <Badge count={count} showZero style={{ backgroundColor: '#5D3FD3' }} />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          color={getStatusColor(status)} 
          text={status.charAt(0).toUpperCase() + status.slice(1)} 
        />
      ),
    },
    {
      title: 'Última Atividade',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            Detalhes
          </Button>
          {record.status === 'pendente' && (
            <Button size="small" type="primary">
              Ativar
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const activeMembers = teamMembers.filter(m => m.status === 'ativo').length;
  const pendingMembers = teamMembers.filter(m => m.status === 'pendente').length;
  const totalProjects = teamMembers.reduce((acc, m) => acc + m.projectsAssigned, 0);
  const adminMembers = teamMembers.filter(m => m.accessLevel === 'admin').length;

  return (
    <div style={{ padding: '0 8px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8, color: '#5D3FD3' }}>
          <TeamOutlined /> Gestão de Equipe - EndoConnect
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Gerenciamento da equipe técnica e de pesquisa da plataforma EndoConnect
        </p>
      </div>

      {pendingMembers > 0 && (
        <Alert
          message={`⏳ ${pendingMembers} novos membros aguardando ativação`}
          description="Existem membros da equipe com acesso pendente que precisam ser ativados no sistema."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary">
              Revisar Pendências
            </Button>
          }
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Membros Ativos"
              value={activeMembers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Aguardando Ativação"
              value={pendingMembers}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total de Projetos"
              value={totalProjects}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#5D3FD3' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Administradores"
              value={adminMembers}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#A6B1E1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="👥 Lista da Equipe">
        <Table
          columns={teamColumns}
          dataSource={teamMembers}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} membros`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Member Details Modal */}
      <Modal
        title="👤 Detalhes do Membro da Equipe"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedMember && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p><strong>Nome:</strong> {selectedMember.name}</p>
                <p><strong>Email:</strong> {selectedMember.email}</p>
                <p><strong>Telefone:</strong> {selectedMember.phone}</p>
                <p><strong>Data de Ingresso:</strong> {selectedMember.joinDate}</p>
              </Col>
              <Col span={12}>
                <p><strong>Função:</strong> 
                  <Tag color={getRoleColor(selectedMember.role)} style={{ marginLeft: 8 }}>
                    {getRoleIcon(selectedMember.role)} {selectedMember.role}
                  </Tag>
                </p>
                <p><strong>Departamento:</strong> {selectedMember.department}</p>
                <p><strong>Especialidade:</strong> {selectedMember.specialty}</p>
                <p><strong>Projetos Atribuídos:</strong> {selectedMember.projectsAssigned}</p>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <p><strong>Nível de Acesso:</strong> 
                  <Tag color={getAccessLevelColor(selectedMember.accessLevel)} style={{ marginLeft: 8 }}>
                    {selectedMember.accessLevel}
                  </Tag>
                </p>
                <p><strong>Status:</strong> 
                  <Tag color={getStatusColor(selectedMember.status)} style={{ marginLeft: 8 }}>
                    {selectedMember.status}
                  </Tag>
                </p>
              </Col>
              <Col span={12}>
                <p><strong>Último Login:</strong> {selectedMember.lastLogin}</p>
                <p><strong>Última Atividade:</strong> {selectedMember.lastActive}</p>
              </Col>
            </Row>
            
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f6ffed', borderRadius: 8 }}>
              <h4>Permissões do Sistema</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedMember.permissions.map(permission => (
                  <Tag key={permission} color="green">
                    {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 