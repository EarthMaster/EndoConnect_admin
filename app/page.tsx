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
} from '@ant-design/icons';
import UserManagement from './components/UserManagement';
import SERPDashboard from './components/SERPDashboard';
import EducationalModules from './components/EducationalModules';
import FeedbackForms from './components/FeedbackForms';
import ClinicalDataManagement from './components/ClinicalDataManagement';

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
      key: 'educational-modules',
      icon: <BookOutlined />,
      label: 'Educational Modules',
    },
    {
      key: 'feedback-forms',
      icon: <FormOutlined />,
      label: 'Feedback & Engagement',
    },
    {
      key: 'clinical-data',
      icon: <MedicineBoxOutlined />,
      label: 'Clinical Data Management',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
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
      case 'educational-modules':
        return <EducationalModules />;
      case 'feedback-forms':
        return <FeedbackForms />;
      case 'clinical-data':
        return <ClinicalDataManagement />;
      case 'settings':
        return (
          <div style={{ padding: 24 }}>
            <h2>Settings</h2>
            <p>System settings and configuration options.</p>
          </div>
        );
      default:
        return <SERPDashboard />;
    }
  };

  const getBreadcrumbTitle = (key: string) => {
    const titles = {
      'serp-dashboard': 'SERP Dashboard',
      'user-management': 'User Management',
      'educational-modules': 'Educational Modules',
      'feedback-forms': 'Feedback & Engagement',
      'clinical-data': 'Clinical Data Management',
      'settings': 'Settings',
    };
    return titles[key as keyof typeof titles] || 'Dashboard';
  };

  const breadcrumbItems = [
    {
      title: 'Admin Panel',
    },
    {
      title: getBreadcrumbTitle(selectedKey),
    },
  ];

  // Mock user role - in real app, this would come from authentication
  const userRole = 'Clinic Admin'; // Could be 'Clinic Admin', 'Researcher', 'Operator'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={280}
        collapsedWidth={80}
      >
        <div style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}>
          {collapsed ? 'AP' : 'Admin Panel'}
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
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
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
              }}
            />
            <Breadcrumb items={breadcrumbItems} />
          </Space>
          
          <Space>
            <Tag color="blue">{userRole}</Tag>
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
                <Avatar icon={<UserOutlined />} />
                <span>Admin User</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 24,
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
