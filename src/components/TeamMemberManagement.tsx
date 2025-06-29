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
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  WarningOutlined,
  EyeOutlined,
  SafetyOutlined,
  UserAddOutlined,
  CheckOutlined,
  ClockCircleOutlined,
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
  invitedBy?: string;
  invitedAt?: string;
  activatedBy?: string;
  activatedAt?: string;
}

interface InvitationLog {
  id: string;
  inviterName: string;
  inviterEmail: string;
  inviteeName: string;
  inviteeEmail: string;
  invitedAt: string;
  status: 'pendente' | 'ativado' | 'rejeitado';
  activatedBy?: string;
  activatedAt?: string;
}

export default function TeamMemberManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitationLogs, setInvitationLogs] = useState<InvitationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteLogsModalVisible, setInviteLogsModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteForm] = Form.useForm();

  // Mock current user - in real app, this would come from authentication
  const currentUser = {
    name: 'Dr. Maria Silva',
    email: 'maria.silva@endoconnect.com',
    id: 'TM-001'
  };

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
          lastActive: 'Nunca',
          invitedBy: 'Dr. Maria Silva',
          invitedAt: '2024-01-20 14:30:00'
        }
      ];

      const mockInvitationLogs: InvitationLog[] = [
        {
          id: 'INV-001',
          inviterName: 'Dr. Maria Silva',
          inviterEmail: 'maria.silva@endoconnect.com',
          inviteeName: 'Dra. Fernanda Lima',
          inviteeEmail: 'fernanda.lima@endoconnect.com',
          invitedAt: '2024-01-20 14:30:00',
          status: 'pendente'
        }
      ];

      setTeamMembers(mockTeamMembers);
      setInvitationLogs(mockInvitationLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setModalVisible(true);
  };

  const handleInviteMember = async () => {
    try {
      const values = await inviteForm.validateFields();
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const newMemberId = `TM-${String(teamMembers.length + 1).padStart(3, '0')}`;
      
      const newMember: TeamMember = {
        id: newMemberId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
        department: values.department,
        specialty: values.specialty,
        permissions: getDefaultPermissions(values.role),
        status: 'pendente',
        joinDate: currentDate.split(' ')[0],
        lastLogin: 'Nunca',
        projectsAssigned: 0,
        accessLevel: values.accessLevel,
        lastActive: 'Nunca',
        invitedBy: currentUser.name,
        invitedAt: currentDate
      };

      const newInvitationLog: InvitationLog = {
        id: `INV-${String(invitationLogs.length + 1).padStart(3, '0')}`,
        inviterName: currentUser.name,
        inviterEmail: currentUser.email,
        inviteeName: values.name,
        inviteeEmail: values.email,
        invitedAt: currentDate,
        status: 'pendente'
      };

      setTeamMembers([...teamMembers, newMember]);
      setInvitationLogs([...invitationLogs, newInvitationLog]);
      setInviteModalVisible(false);
      inviteForm.resetFields();
      message.success(`Convite enviado para ${values.name}!`);
    } catch {
      message.error('Erro ao enviar convite');
    }
  };

  const handleActivateMember = async (memberId: string) => {
    try {
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      setTeamMembers(teamMembers.map(member => 
        member.id === memberId 
          ? { 
              ...member, 
              status: 'ativo',
              activatedBy: currentUser.name,
              activatedAt: currentDate,
              lastLogin: currentDate.split(' ')[0],
              lastActive: 'Recém ativado'
            }
          : member
      ));

      setInvitationLogs(invitationLogs.map(log => 
        log.inviteeEmail === teamMembers.find(m => m.id === memberId)?.email
          ? { 
              ...log, 
              status: 'ativado',
              activatedBy: currentUser.name,
              activatedAt: currentDate
            }
          : log
      ));

      message.success('Membro ativado com sucesso!');
    } catch {
      message.error('Erro ao ativar membro');
    }
  };

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'coordenador':
        return ['user_management', 'data_analysis', 'team_management', 'system_config'];
      case 'pesquisador':
        return ['data_analysis', 'screening_questions', 'educational_modules'];
      case 'desenvolvedor':
        return ['system_config', 'user_management', 'data_export'];
      case 'analista':
        return ['data_analysis', 'feedback_data'];
      default:
        return ['data_analysis'];
    }
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
            <Popconfirm
              title="Ativar membro?"
              description={`Deseja ativar o acesso de ${record.name} ao sistema?`}
              onConfirm={() => handleActivateMember(record.id)}
              okText="Sim, ativar"
              cancelText="Cancelar"
            >
              <Button size="small" type="primary" icon={<CheckOutlined />}>
                Ativar
              </Button>
            </Popconfirm>
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
            <Button size="small" type="primary" onClick={() => setInviteLogsModalVisible(true)}>
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

      <Card 
        title="👥 Lista da Equipe"
        extra={
          <Space>
            <Button 
              type="default" 
              icon={<ClockCircleOutlined />} 
              onClick={() => setInviteLogsModalVisible(true)}
            >
              Histórico de Convites
            </Button>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />} 
              onClick={() => setInviteModalVisible(true)}
            >
              Convidar Membro
            </Button>
          </Space>
        }
      >
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

      {/* Invite Member Modal */}
      <Modal
        title="👨‍💼 Convidar Novo Membro"
        open={inviteModalVisible}
        onCancel={() => {
          setInviteModalVisible(false);
          inviteForm.resetFields();
        }}
        onOk={handleInviteMember}
        width={700}
        okText="Enviar Convite"
        cancelText="Cancelar"
      >
        <Form
          form={inviteForm}
          layout="vertical"
          style={{ maxWidth: '100%' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nome Completo"
                name="name"
                rules={[{ required: true, message: 'Nome é obrigatório' }]}
              >
                <Input placeholder="Ex: Dr. João Silva" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Email é obrigatório' },
                  { type: 'email', message: 'Email inválido' }
                ]}
              >
                <Input placeholder="Ex: joao.silva@endoconnect.com" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Telefone"
                name="phone"
                rules={[{ required: true, message: 'Telefone é obrigatório' }]}
              >
                <Input placeholder="Ex: +55 11 99999-0000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Especialidade"
                name="specialty"
                rules={[{ required: true, message: 'Especialidade é obrigatória' }]}
              >
                <Input placeholder="Ex: Ginecologia, Psicologia" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Função"
                name="role"
                rules={[{ required: true, message: 'Função é obrigatória' }]}
              >
                <Select placeholder="Selecione a função">
                  <Select.Option value="coordenador">Coordenador</Select.Option>
                  <Select.Option value="pesquisador">Pesquisador</Select.Option>
                  <Select.Option value="desenvolvedor">Desenvolvedor</Select.Option>
                  <Select.Option value="analista">Analista</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Departamento"
                name="department"
                rules={[{ required: true, message: 'Departamento é obrigatório' }]}
              >
                <Select placeholder="Selecione o departamento">
                  <Select.Option value="Coordenação Técnica">Coordenação Técnica</Select.Option>
                  <Select.Option value="Pesquisa Clínica">Pesquisa Clínica</Select.Option>
                  <Select.Option value="Tecnologia">Tecnologia</Select.Option>
                  <Select.Option value="Análise de Dados">Análise de Dados</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Nível de Acesso"
                name="accessLevel"
                rules={[{ required: true, message: 'Nível de acesso é obrigatório' }]}
              >
                <Select placeholder="Selecione o nível">
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="moderador">Moderador</Select.Option>
                  <Select.Option value="usuario">Usuário</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Invitation Logs Modal */}
      <Modal
        title="📋 Histórico de Convites"
        open={inviteLogsModalVisible}
        onCancel={() => setInviteLogsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setInviteLogsModalVisible(false)}>
            Fechar
          </Button>
        ]}
        width={900}
      >
        <Table
          dataSource={invitationLogs}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Convidado',
              key: 'invitee',
              render: (_, record) => (
                <div>
                  <div style={{ fontWeight: 'bold' }}>{record.inviteeName}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{record.inviteeEmail}</div>
                </div>
              ),
            },
            {
              title: 'Convidado por',
              key: 'inviter',
              render: (_, record) => (
                <div>
                  <div style={{ fontWeight: 'bold' }}>{record.inviterName}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{record.inviterEmail}</div>
                </div>
              ),
            },
            {
              title: 'Data do Convite',
              dataIndex: 'invitedAt',
              key: 'invitedAt',
              render: (date: string) => new Date(date).toLocaleString('pt-BR'),
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => {
                const colors = {
                  'pendente': '#faad14',
                  'ativado': '#52c41a',
                  'rejeitado': '#f5222d'
                };
                return (
                  <Tag color={colors[status as keyof typeof colors]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Tag>
                );
              },
            },
            {
              title: 'Ativado por',
              key: 'activated',
              render: (_, record) => (
                record.activatedBy ? (
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{record.activatedBy}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {record.activatedAt ? new Date(record.activatedAt).toLocaleString('pt-BR') : ''}
                    </div>
                  </div>
                ) : (
                  <span style={{ color: '#999' }}>-</span>
                )
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
} 