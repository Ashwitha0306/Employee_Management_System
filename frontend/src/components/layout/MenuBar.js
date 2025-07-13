// src/components/layout/MenuBar.js

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import './MenuBar.css';

const MenuBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // adjust token name as needed
    navigate('/login');
  };

  const getLinkClass = ({ isActive }) =>
    isActive ? 'menu-link active' : 'menu-link';

  return (
    <nav className="menu-bar">
      <div className="menu-title">Admin Panel</div>
      <ul className="menu-list">
        <li><NavLink to="/admin" className={getLinkClass}>Dashboard</NavLink></li>
        <li><NavLink to="/admin/employees" className={getLinkClass}>Employees</NavLink></li>
        <li><NavLink to="/admin/departments" className={getLinkClass}>Departments</NavLink></li>
        <li><NavLink to="/admin/performance" className={getLinkClass}>Performance</NavLink></li>
        <li><NavLink to="/admin/salaries" className={getLinkClass}>Salaries</NavLink></li>
        <li>
          <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
            <LogoutOutlined /> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default MenuBar;
