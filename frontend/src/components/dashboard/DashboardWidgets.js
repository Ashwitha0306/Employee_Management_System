import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardWidgets = () => {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    totalSalary: 0,
  });

  const [performanceData, setPerformanceData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, deptRes, salaryRes, perfRes] = await Promise.all([
          axios.get('http://localhost:5000/api/employees'),
          axios.get('http://localhost:5000/api/departments'),
          axios.get('http://localhost:5000/api/salaries'),
          axios.get('http://localhost:5000/api/performance'),
        ]);

        const totalSalary = salaryRes.data.reduce((sum, s) => sum + s.amount, 0);

        setStats({
          employees: empRes.data.length,
          departments: deptRes.data.length,
          totalSalary,
        });

        setPerformanceData(perfRes.data);

        const sorted = [...perfRes.data].sort((a, b) => b.rating - a.rating).slice(0, 3);
        setTopPerformers(sorted);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  const chartData = {
    labels: [...new Set(performanceData.map(p => `${p.month} ${p.year}`))],
    datasets: [
      {
        label: 'Avg Performance Rating',
        data: Object.values(
          performanceData.reduce((acc, cur) => {
            const key = `${cur.month} ${cur.year}`;
            if (!acc[key]) acc[key] = { total: 0, count: 0 };
            acc[key].total += cur.rating;
            acc[key].count += 1;
            return acc;
          }, {})
        ).map(val => (val.total / val.count).toFixed(2)),
        backgroundColor: '#4caf50',
        borderRadius: 6,
        barThickness: 30,
      }
    ]
  };

  const cardStyle = {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    flex: '1',
    minWidth: '220px',
    transition: 'transform 0.3s ease',
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Dashboard Cards */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '30px',
        justifyContent: 'space-between'
      }}>
        {[
          { title: 'Total Employees', value: stats.employees },
          { title: 'Total Departments', value: stats.departments },
          { title: 'Total Monthly Salary', value: `₹${stats.totalSalary.toLocaleString()}` },
          { title: 'Performance Records', value: performanceData.length }
        ].map((card, i) => (
          <div key={i} style={cardStyle}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>{card.title}</h3>
            <p style={{ fontSize: '22px', fontWeight: 600, color: '#00796b' }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Top Performers */}
      <div style={{ ...cardStyle, marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '10px' }}>🏆 Top 3 Performers</h3>
        {topPerformers.length === 0 ? (
          <p>No performance records yet.</p>
        ) : (
          <ul style={{ paddingLeft: '18px', lineHeight: 1.8 }}>
            {topPerformers.map((p, index) => (
              <li key={p._id}>
                <strong>{index + 1}. {p.empName}</strong> — Rating: {p.rating} ({p.month} {p.year})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bar Chart */}
      <div style={{ ...cardStyle, paddingBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px' }}>📊 Monthly Avg Ratings</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default DashboardWidgets;
