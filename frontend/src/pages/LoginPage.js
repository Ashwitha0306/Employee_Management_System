// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedEmail === 'admin@gmail.com' && trimmedPassword === 'admin123') {
      localStorage.setItem('admin', JSON.stringify({ name: 'Admin', email }));
      navigate('/admin');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>Email</label>
        <input
          type="email"
          placeholder="admin@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="admin123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link to="#">Forgot password?</Link>
        </div>

        <button type="submit">Login</button>

        <p style={{ marginTop: '20px' }}>
          Are you an employee? <Link to="/employee/login" style={{ color: '#00bcd4' }}>Login here</Link>
        </p>
      </form>
    </motion.div>
  );
};

export default LoginPage;
