// src/pages/EmployeeSalary.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeSalary.css';
import { motion } from 'framer-motion';

const EmployeeSalary = () => {
  const employee = JSON.parse(localStorage.getItem('employee') || '{}');
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/salaries');
        const mine = res.data.filter(s => s.empId === employee._id);
        setRecords(mine);
        setFiltered(mine);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSalary();
  }, [employee._id]);

  useEffect(() => {
    const f = records.filter(r =>
      (`${r.month} ${r.year}`).toLowerCase().includes(filter.toLowerCase())
    );
    setFiltered(f);
  }, [filter, records]);

  return (
    <motion.div
      className="salary-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        My Salary Records
      </motion.h2>

      <motion.input
        type="text"
        placeholder="Search by month or year"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      <motion.table
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <thead>
          <tr>
            <th>SNo</th>
            <th>Month</th>
            <th>Year</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, idx) => (
            <motion.tr
              key={r._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <td>{idx + 1}</td>
              <td>{r.month}</td>
              <td>{r.year}</td>
              <td>₹{r.amount}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default EmployeeSalary;
