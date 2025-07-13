// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard'; // ✅ correct path

import EmployeeList from './components/employees/EmployeeList';
import DepartmentList from './components/departments/DepartmentList';
import SalaryList from './components/salaries/SalaryList';
import PerformancePage from './components/performance/PerformancePage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeLoginPage from './pages/EmployeeLoginPage';
// ✅ This must be from /pages if it's employee-only
import EmployeeSalary from './pages/EmployeeSalary';

import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employee/login" element={<EmployeeLoginPage />} />

        {/* ✅ Employee Routes (Accessible without admin layout) */}
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
    
        <Route path="/employee-salary" element={<EmployeeSalary />} />

        {/* ✅ Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="salaries" element={<SalaryList />} />
          <Route path="performance" element={<PerformancePage />} />

        </Route>

        {/* ✅ Fallbacks */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
