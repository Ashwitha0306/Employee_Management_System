import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EmployeeNavbar.css';

const EmployeeNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    navigate('/employee/login');
  };

  return (
    <nav className="employee-navbar">
      <ul>
        <li><Link to="/employee/apply-leave">Apply Leave</Link></li>
        <li><Link to="/employee/my-leaves">My Leaves</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default EmployeeNavbar;
