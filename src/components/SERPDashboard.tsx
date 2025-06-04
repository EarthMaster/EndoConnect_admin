'use client';

import { Card, Row, Col, Statistic, Progress, Alert, Table, Tag, Space, Button, Tabs, Divider } from 'antd';
import { 
  HeartOutlined, 
  WarningOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  RiseOutlined,
  DashboardOutlined,
  EyeOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  AlertOutlined,
  TrophyOutlined,
  BarChartOutlined
} from '@ant-design/icons';

export default function SERPDashboard() {
  // Mock data for SERP metrics
  const serpOverview = {
    totalUsers: 156,
    activeUsers: 98,
    weeklyTriages: 47,
    avgEngagementScore: 73.5
  };

  // 🔸 SYMPTOM PROFILE DATA - What users are reporting in triage
  const symptomProfileData = {
    primarySymptoms: [
      { symptom: '🩸 Dor Pélvica', users: 95, percentage: 61.0, trend: '+5%' },
      { symptom: '🦠 Sintomas Intestinais', users: 34, percentage: 21.8, trend: '+2%' },
      { symptom: '💧 Sintomas Urinários', users: 19, percentage: 12.2, trend: '-1%' },
      { symptom: '🧠 Impacto Emocional', users: 26, percentage: 16.7, trend: '+8%' }
    ],
    severityDistribution: {
      mild: 45,      // Leve
      moderate: 67,  // Moderado  
      severe: 44     // Severo
    },
    newSymptoms: 12, // New symptoms reported this week
    triageCompletion: 94.2
  };

  // 🔸 ENGAGEMENT SCORE DATA - How they interact with educational content  
  const engagementData = {
    moduleEngagement: [
      { module: 'Entendendo a Endometriose', views: 89, completions: 76, rate: 85.4 },
      { module: 'Dor Pélvica: Quando Procurar Ajuda', views: 67, completions: 62, rate: 92.5 },
      { module: 'Sintomas Intestinais', views: 45, completions: 35, rate: 77.8 },
      { module: 'Apoio Emocional', views: 78, completions: 58, rate: 74.4 }
    ],
    avgSessionDuration: '8m 34s',
    supportGroupParticipation: 34.8,
    weeklyActiveUsers: 89,
    feedbackSubmissions: 23
  };

  // 🔸 PSYCHOSOCIAL RISK DATA - Warning signs from screening answers
  const riskProfileData = {
    riskDistribution: {
      low: 88,     // Baixo risco
      medium: 45,  // Risco médio
      high: 23     // Alto risco
    },
    urgentCases: [
      {
        userId: 'ANON-8742',
        profile: 'Emocional + Pélvico',
        riskScore: 85,
        lastActivity: '2h atrás',
        alerts: ['Ansiedade severa', 'Isolamento social'],
        status: 'urgente'
      },
      {
        userId: 'ANON-3921', 
        profile: 'Misto',
        riskScore: 78,
        lastActivity: '5 dias',
        alerts: ['Baixo engajamento', 'Sintomas severos'],
        status: 'necessita-atencao'
      },
      {
        userId: 'ANON-5647',
        profile: 'Pélvico',
        riskScore: 82,
        lastActivity: '1 dia',
        alerts: ['Depressão moderada', 'Perda de interesse'],
        status: 'urgente'
      }
    ],
    weeklyRiskAlerts: 15,
    interventionsNeeded: 8
  };

  const riskMonitoringColumns = [
    {
      title: 'Usuária',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string, record: any) => (
        <Space direction="vertical" size="small">
          <Tag color="#5D3FD3">{userId}</Tag>
          <Tag color="#A6B1E1" style={{ fontSize: '11px' }}>{record.profile}</Tag>
        </Space>
      ),
    },
    {
      title: 'Score de Risco',
      dataIndex: 'riskScore',
      key: 'riskScore',
      render: (score: number) => (
        <div>
          <Progress 
            percent={score} 
            size="small" 
            status={score > 80 ? 'exception' : score > 60 ? 'normal' : 'success'}
            strokeColor={score > 80 ? '#f5222d' : score > 60 ? '#faad14' : '#52c41a'}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>{score}/100</span>
        </div>
      ),
    },
    {
      title: 'Alertas Ativos',
      dataIndex: 'alerts',
      key: 'alerts',
      render: (alerts: string[]) => (
        <div>
          {alerts.map((alert, idx) => (
            <Tag key={idx} color="orange" style={{ marginBottom: 2, fontSize: '11px' }}>
              {alert}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Última Atividade',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      render: (activity: string) => (
        <Space>
          <ClockCircleOutlined />
          {activity}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          'urgente': { color: '#f5222d', text: '🚨 Intervenção Urgente' },
          'necessita-atencao': { color: '#fa541c', text: '⚠️ Necessita Atenção' },
          'monitoramento': { color: '#faad14', text: '👀 Em Monitoramento' },
          'estavel': { color: '#52c41a', text: '✅ Estável' }
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>Ver Perfil</Button>
          {record.status === 'urgente' && (
            <Button size="small" type="primary" danger icon={<ExclamationCircleOutlined />}>
              Intervir
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return '#f5222d';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  return (
    <div style={{ padding: '0 8px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8, color: '#5D3FD3' }}>
          <DashboardOutlined /> SERP Dashboard - Symptom, Engagement & Risk Profile
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Monitoramento em tempo real de perfis sintomáticos, engajamento e risco psicossocial das usuárias EndoConnect
        </p>
      </div>

      {/* Overview Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total de Usuárias"
              value={serpOverview.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#5D3FD3' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Usuárias Ativas"
              value={serpOverview.activeUsers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Triagens (7 dias)"
              value={serpOverview.weeklyTriages}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#A6B1E1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Score Engajamento Médio"
              value={serpOverview.avgEngagementScore}
              precision={1}
              suffix="/100"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#F76C6C' }}
            />
          </Card>
        </Col>
      </Row>

      {/* High Priority Alert */}
      <Alert
        message="🚨 8 usuárias necessitam intervenção prioritária"
        description="Alto risco psicossocial detectado com base nas respostas da triagem e padrões de engajamento."
        type="error"
        showIcon
        action={
          <Button size="small" danger type="primary">
            Ver Casos Urgentes
          </Button>
        }
        style={{ marginBottom: 24 }}
      />

      {/* SERP Tabs */}
      <Tabs 
        defaultActiveKey="symptoms" 
        type="card"
        items={[
          {
            key: 'symptoms',
            label: '🩺 Perfil de Sintomas',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Card title="Distribuição de Sintomas Primários">
                    <div style={{ marginBottom: 16 }}>
                      {symptomProfileData.primarySymptoms.map((item, index) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span><strong>{item.symptom}</strong></span>
                            <Space>
                              <span>{item.users} usuárias ({item.percentage}%)</span>
                              <Tag color={item.trend.includes('+') ? 'green' : 'red'}>
                                {item.trend}
                              </Tag>
                            </Space>
                          </div>
                          <Progress 
                            percent={item.percentage} 
                            strokeColor="#5D3FD3"
                            trailColor="#f0f0f0"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    <Card title="Severidade dos Sintomas">
                      <div style={{ textAlign: 'center' }}>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Statistic
                              title="Leve"
                              value={symptomProfileData.severityDistribution.mild}
                              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic
                              title="Moderado"
                              value={symptomProfileData.severityDistribution.moderate}
                              valueStyle={{ color: '#faad14', fontSize: '18px' }}
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic
                              title="Severo"
                              value={symptomProfileData.severityDistribution.severe}
                              valueStyle={{ color: '#f5222d', fontSize: '18px' }}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Card>
                    
                    <Card>
                      <Statistic
                        title="Novos Sintomas (7 dias)"
                        value={symptomProfileData.newSymptoms}
                        prefix={<AlertOutlined />}
                        valueStyle={{ color: '#F76C6C' }}
                      />
                    </Card>
                    
                    <Card>
                      <Statistic
                        title="Taxa de Conclusão da Triagem"
                        value={symptomProfileData.triageCompletion}
                        precision={1}
                        suffix="%"
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Space>
                </Col>
              </Row>
            ),
          },
          {
            key: 'engagement',
            label: '📚 Score de Engajamento',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Card title="Engajamento com Módulos Educativos">
                    <Table
                      dataSource={engagementData.moduleEngagement}
                      pagination={false}
                      size="small"
                      columns={[
                        {
                          title: 'Módulo',
                          dataIndex: 'module',
                          key: 'module',
                        },
                        {
                          title: 'Visualizações',
                          dataIndex: 'views',
                          key: 'views',
                        },
                        {
                          title: 'Conclusões',
                          dataIndex: 'completions',
                          key: 'completions',
                        },
                        {
                          title: 'Taxa de Conclusão',
                          dataIndex: 'rate',
                          key: 'rate',
                          render: (rate: number) => (
                            <Progress 
                              percent={rate} 
                              size="small" 
                              status={rate > 85 ? 'success' : rate > 70 ? 'active' : 'exception'}
                            />
                          ),
                        },
                      ]}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    <Card>
                      <Statistic
                        title="Duração Média da Sessão"
                        value={engagementData.avgSessionDuration}
                        prefix={<ClockCircleOutlined />}
                        valueStyle={{ color: '#5D3FD3' }}
                      />
                    </Card>
                    
                    <Card>
                      <Statistic
                        title="Participação Grupo de Apoio"
                        value={engagementData.supportGroupParticipation}
                        precision={1}
                        suffix="%"
                        prefix={<HeartOutlined />}
                        valueStyle={{ color: '#F76C6C' }}
                      />
                    </Card>
                    
                    <Card>
                      <Statistic
                        title="Usuárias Ativas (7 dias)"
                        value={engagementData.weeklyActiveUsers}
                        prefix={<UserOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                    
                    <Card>
                      <Statistic
                        title="Feedbacks Enviados"
                        value={engagementData.feedbackSubmissions}
                        prefix={<BarChartOutlined />}
                        valueStyle={{ color: '#A6B1E1' }}
                      />
                    </Card>
                  </Space>
                </Col>
              </Row>
            ),
          },
          {
            key: 'risk',
            label: '⚠️ Risco Psicossocial',
            children: (
              <>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col xs={24} md={8}>
                    <Card title="Distribuição de Risco">
                      <div style={{ textAlign: 'center' }}>
                        <Row gutter={16}>
                          <Col span={24}>
                            <Statistic
                              title="🔴 Alto Risco"
                              value={riskProfileData.riskDistribution.high}
                              valueStyle={{ color: '#f5222d', fontSize: '24px' }}
                            />
                            <Progress
                              percent={(riskProfileData.riskDistribution.high / serpOverview.totalUsers) * 100}
                              strokeColor="#f5222d"
                              showInfo={false}
                              style={{ marginBottom: 16 }}
                            />
                          </Col>
                          <Col span={24}>
                            <Statistic
                              title="🟡 Risco Médio"
                              value={riskProfileData.riskDistribution.medium}
                              valueStyle={{ color: '#faad14', fontSize: '24px' }}
                            />
                            <Progress
                              percent={(riskProfileData.riskDistribution.medium / serpOverview.totalUsers) * 100}
                              strokeColor="#faad14"
                              showInfo={false}
                              style={{ marginBottom: 16 }}
                            />
                          </Col>
                          <Col span={24}>
                            <Statistic
                              title="🟢 Baixo Risco"
                              value={riskProfileData.riskDistribution.low}
                              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                            />
                            <Progress
                              percent={(riskProfileData.riskDistribution.low / serpOverview.totalUsers) * 100}
                              strokeColor="#52c41a"
                              showInfo={false}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        title="Alertas de Risco (7 dias)"
                        value={riskProfileData.weeklyRiskAlerts}
                        prefix={<WarningOutlined />}
                        valueStyle={{ color: '#fa541c' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        title="Intervenções Necessárias"
                        value={riskProfileData.interventionsNeeded}
                        prefix={<ExclamationCircleOutlined />}
                        valueStyle={{ color: '#f5222d' }}
                      />
                    </Card>
                  </Col>
                </Row>
      
                <Card title="Casos Prioritários para Intervenção">
                  <Table
                    dataSource={riskProfileData.urgentCases}
                    columns={riskMonitoringColumns}
                    pagination={false}
                    size="small"
                    rowKey="userId"
                  />
                </Card>
              </>
            ),
          },
        ]}
      />
    </div>
  );
} 