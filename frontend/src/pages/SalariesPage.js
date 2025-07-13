// src/pages/SalariesPage.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './TablePage.css';

const SalariesPage = () => {
  const [search, setSearch] = useState('');

  const salaries = [
    {
      id: 1,
      month: 'May 2024',
      amount: '₹50,000',
      date: '2024-06-01',
      status: 'Credited',
    },
    {
      id: 2,
      month: 'April 2024',
      amount: '₹50,000',
      date: '2024-05-01',
      status: 'Credited',
    },
  ];

  const filteredSalaries = salaries.filter((sal) =>
    sal.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="table-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h2>Salary Details</h2>

      <motion.input
        type="text"
        placeholder="Search By Status"
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        whileFocus={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      />

      <motion.table
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <thead>
          <tr>
            <th>SNO</th>
            <th>Month</th>
            <th>Amount</th>
            <th>Credited Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalaries.map((sal, index) => (
            <motion.tr
              key={sal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <td>{index + 1}</td>
              <td>{sal.month}</td>
              <td>{sal.amount}</td>
              <td>{sal.date}</td>
              <td>{sal.status}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default SalariesPage;
