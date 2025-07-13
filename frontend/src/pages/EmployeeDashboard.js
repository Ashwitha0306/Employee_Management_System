import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Card, Row, Col, Typography, Button, Switch, Spin } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  ApartmentOutlined,
  DollarOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import './EmployeeDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const EmployeeDashboard = () => {
  const employee = useMemo(() => JSON.parse(localStorage.getItem('employee')), []);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/performance/${employee._id}`)
      .then(res => setPerformance(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [employee]);

  if (loading) return <Spin size="large" className="loading-spinner" />;

  const perfLabels = performance.map(p => `${p.month} ${p.year}`);
  const perfValues = performance.map(p => p.rating);

  const barData = {
    labels: perfLabels,
    datasets: [
      {
        label: 'Performance Rating',
        data: perfValues,
        backgroundColor: '#4096ff'
      }
    ],
  };

  return (
    <Layout className={`emp-layout ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <Header className="emp-header">
        <Title level={3} className="header-title">
          <UserOutlined /> Employee Dashboard
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Switch
            checkedChildren="🌙"
            unCheckedChildren="☀️"
            checked={darkMode}
            onChange={checked => setDarkMode(checked)}
          />
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem('employee');
              window.location.href = '/employee/login';
            }}
          >
            Logout
          </Button>
        </div>
      </Header>

      <Content className="emp-content">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <Card className="welcome-card" bordered={false}>
            <Title level={2}><UserOutlined /> Welcome, {employee.name}</Title>
          </Card>
        </motion.div>

        <Row gutter={24} className="info-row">
          {[{
            icon: <MailOutlined className="info-icon" />,
            label: 'Email',
            value: employee.email
          }, {
            icon: <ApartmentOutlined className="info-icon" />,
            label: 'Department',
            value: employee.department
          }, {
            icon: <DollarOutlined className="info-icon" />,
            label: 'Salary',
            value: `₹${employee.salary}`
          }].map((item, i) => (
            <Col xs={24} sm={8} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i, duration: 0.5 }}
              >
                <Card className="info-card" bordered={false}>
                  {item.icon}
                  <Text>{item.label}</Text>
                  <Title level={3}>{item.value}</Title>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Card title="Your Performance Over Time" className="perf-chart-card" bordered={false}>
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Card>
        </motion.div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>Employee Management System ©2025</Footer>
    </Layout>
  );
};

export default EmployeeDashboard;
