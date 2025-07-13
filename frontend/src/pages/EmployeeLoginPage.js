// src/pages/EmployeeLoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './LoginPage.css';

const EmployeeLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/employees/login', {
        email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem('employee', JSON.stringify(res.data.employee));
        navigate('/employee-dashboard');
      }
    } catch (err) {
      alert('Invalid credentials');
      console.error('Login error:', err);
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Employee Login
      </motion.h2>

      <motion.form
        onSubmit={handleLogin}
        className="login-form"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <motion.span
            className="eye-icon"
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </motion.span>
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link to="#">Forgot password?</Link>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>

        <motion.p
          style={{ marginTop: '20px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Are you an admin?{' '}
          <Link to="/login" style={{ color: '#00bcd4' }}>
            Login here
          </Link>
        </motion.p>
      </motion.form>
    </motion.div>
  );
};

export default EmployeeLoginPage;
