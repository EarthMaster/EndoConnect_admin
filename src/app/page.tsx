'use client';

import { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  theme,
  Space,
  Avatar,
  Dropdown,
  Breadcrumb,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,  
  TeamOutlined,
  BookOutlined,
  FormOutlined,
  MedicineBoxOutlined,
  BarChartOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import UserManagement from '../components/UserManagement';
import TeamMemberManagement from '../components/TeamMemberManagement';
import SERPDashboard from '../components/SERPDashboard';
import EducationalModules from '../components/EducationalModules';
import ScreeningQuestionManagement from '../components/FeedbackForms';
import ClinicalDataManagement from '../components/ClinicalDataManagement';

const { Header, Sider, Content } = Layout;

export default function AdminPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('serp-dashboard');
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'serp-dashboard',
      icon: <BarChartOutlined />,
      label: 'SERP Dashboard',
    },
    {
      key: 'user-management',
      icon: <TeamOutlined />,
      label: 'User Management',
    },
    {
      key: 'team-member-management',
      icon: <UserOutlined />,
      label: 'Team Member Management',
    },
    {
      key: 'screening-questions',
      icon: <FormOutlined />,
      label: 'Screening Questions',
    },
    {
      key: 'educational-modules',
      icon: <BookOutlined />,
      label: 'Educational Modules',
    },
    {
      key: 'feedback-data',
      icon: <DashboardOutlined />,
      label: 'Feedback & Data',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'serp-dashboard':
        return <SERPDashboard />;
      case 'user-management':
        return <UserManagement />;
      case 'team-member-management':
        return <TeamMemberManagement />;
      case 'screening-questions':
        return <ScreeningQuestionManagement />;
      case 'educational-modules':
        return <EducationalModules />;
      case 'feedback-data':
        return <ClinicalDataManagement />;
      default:
        return <SERPDashboard />;
    }
  };

  const getBreadcrumbTitle = (key: string) => {
    const titles = {
      'serp-dashboard': 'SERP Dashboard',
      'user-management': 'User Management',
      'team-member-management': 'Team Member Management',
      'screening-questions': 'Screening Questions',
      'educational-modules': 'Educational Modules',
      'feedback-data': 'Feedback & Data Management',
    };
    return titles[key as keyof typeof titles] || 'SERP Dashboard';
  };

  const breadcrumbItems = [
    {
      title: 'EndoConnect Admin',
    },
    {
      title: getBreadcrumbTitle(selectedKey),
    },
  ];

  // Mock user role - in real app, this would come from authentication
  const userRole = 'Coordenador Técnico'; // Could be 'Coordenador Técnico', 'Pesquisador', 'Desenvolvedor'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={280}
        collapsedWidth={80}
        theme="dark"
      >
        <div style={{
          height: 64,
          margin: 16,
          background: 'linear-gradient(135deg, #5D3FD3, #A6B1E1)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: collapsed ? '14px' : '16px',
        }}>
          {collapsed ? 'EC' : 'EndoConnect'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(93, 63, 211, 0.1)',
            borderBottom: '2px solid #5D3FD3',
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color: '#5D3FD3',
              }}
            />
            <Breadcrumb items={breadcrumbItems} />
          </Space>
          
          <Space>
            <Tag color="#5D3FD3">{userRole}</Tag>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => {
                  if (key === 'logout') {
                    console.log('Logout clicked');
                  }
                },
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#5D3FD3' }} icon={<UserOutlined />} />
                <span>Pavlo (Dev)</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
