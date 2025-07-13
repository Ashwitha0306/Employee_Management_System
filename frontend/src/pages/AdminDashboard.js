import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Space } from 'antd';
import {
  TeamOutlined,
  ApartmentOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { motion } from 'framer-motion';
import './AdminDashboard.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const { Title } = Typography;

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [empRes, deptRes, salRes, perfRes] = await Promise.all([
      axios.get('http://localhost:5000/api/employees'),
      axios.get('http://localhost:5000/api/departments'),
      axios.get('http://localhost:5000/api/salaries'),
      axios.get('http://localhost:5000/api/performance'),
    ]);
    setEmployees(empRes.data);
    setDepartments(deptRes.data);
    setSalaries(salRes.data);
    setPerformance(perfRes.data);
  };

  const monthlySalary = salaries.reduce(
    (total, s) => total + parseInt(s.amount),
    0
  );

  const salaryData = {
    labels: salaries.map((s) => s.empName),
    datasets: [
      {
        label: 'Salary (₹)',
        data: salaries.map((s) => s.amount),
        backgroundColor: '#4096ff',
      },
    ],
  };

  const remarkLabels = ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'];
  const remarkCounts = remarkLabels.map(
    (label) => performance.filter((p) => p.remarks === label).length
  );

  const performanceData = {
    labels: remarkLabels,
    datasets: [
      {
        label: 'Performance Remarks',
        data: remarkCounts,
        backgroundColor: [
          '#4caf50',
          '#2196f3',
          '#ffc107',
          '#ff9800',
          '#f44336',
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <motion.div
      className="admin-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Title level={3}>Dashboard Overview</Title>
      </motion.div>

      <Row gutter={[16, 16]}>
        {[{
          icon: <TeamOutlined className="icon blue" />,
          label: 'Total Employees',
          value: employees.length
        }, {
          icon: <ApartmentOutlined className="icon purple" />,
          label: 'Total Departments',
          value: departments.length
        }, {
          icon: <DollarOutlined className="icon red" />,
          label: 'Monthly Pay',
          value: `₹${monthlySalary.toLocaleString()}`
        }].map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="dashboard-card" bordered>
                <Space direction="vertical">
                  {item.icon}
                  <span>{item.label}</span>
                  <Title level={3}>{item.value}</Title>
                </Space>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: '30px' }}>
        <Col xs={24} md={12}>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card title="Salary Distribution" bordered className="chart-card">
              <Bar data={salaryData} />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} md={12}>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card title="Employee Performance (Remarks)" bordered className="chart-card pie-small">
              <Pie data={performanceData} options={pieOptions} height={180} />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default AdminDashboard;
