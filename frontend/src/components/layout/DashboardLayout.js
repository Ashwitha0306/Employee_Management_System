// src/components/layout/DashboardLayout.js
import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ApartmentOutlined,
  DollarOutlined,
  LogoutOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

import './DashboardLayout.css';

const { Sider, Content, Header } = Layout;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('adminToken');
      navigate('/login');
    }
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <NavLink to="/admin">Dashboard</NavLink>,
    },
    {
      key: '/admin/employees',
      icon: <UserOutlined />,
      label: <NavLink to="/admin/employees">Employees</NavLink>,
    },
    {
      key: '/admin/departments',
      icon: <ApartmentOutlined />,
      label: <NavLink to="/admin/departments">Departments</NavLink>,
    },
    {
      key: '/admin/salaries',
      icon: <DollarOutlined />,
      label: <NavLink to="/admin/salaries">Salaries</NavLink>,
    },
    {
      key: '/admin/performance',
      icon: <BarChartOutlined />,
      label: <NavLink to="/admin/performance">Performance</NavLink>,
    },
    {
      key: '/logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} className="sidebar">
        <div className="logo">Admin Panel</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout className="site-layout">
        <Header className="site-header">
          <h2>Employee Management Admin Dashboard</h2>
        </Header>
        <Content className="dashboard-main">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
