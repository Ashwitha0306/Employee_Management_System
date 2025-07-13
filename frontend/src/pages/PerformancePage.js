// src/pages/PerformancePage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Select, Space, Typography, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import './PerformancePage.css';

const { Option } = Select;
const { Title } = Typography;

const remarksOptions = ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const years = [2025, 2024, 2023];

const PerformancePage = () => {
  const [form] = Form.useForm();
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [visible, setVisible] = useState(false);

  const baseURL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchPerformance();
    axios.get(`${baseURL}/employees`)
      .then(res => setEmployees(res.data))
      .catch(err => {
        console.error('Error fetching employees:', err);
        message.error('Failed to load employees');
      });
  }, []);

  const fetchPerformance = () => {
    axios.get(`${baseURL}/performance`)
      .then(res => setRecords(res.data))
      .catch(err => {
        console.error('Error fetching performance:', err);
        message.error('Failed to load performance data');
      });
  };

  const handleSubmit = async values => {
    try {
      const selectedEmp = employees.find(e => e._id === values.empId);
      if (!selectedEmp) {
        message.error('Invalid employee selected');
        return;
      }

      const payload = { ...values, empName: selectedEmp.name };

      if (editing) {
        await axios.put(`${baseURL}/performance/${editing._id}`, payload);
        message.success('Performance updated');
      } else {
        await axios.post(`${baseURL}/performance`, payload);
        message.success('Performance added');
      }

      setVisible(false);
      form.resetFields();
      setEditing(null);
      fetchPerformance();
    } catch (err) {
      console.error('Error saving performance:', err);
      message.error('Failed to save performance data');
    }
  };

  const handleEdit = record => {
    setEditing(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`${baseURL}/performance/${id}`);
      message.success('Deleted successfully');
      fetchPerformance();
    } catch (err) {
      console.error('Error deleting performance:', err);
      message.error('Failed to delete');
    }
  };

  return (
    <motion.div
      className="performance-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Space style={{ justifyContent: 'space-between', marginBottom: 20, width: '100%' }}>
        <Title level={3}>Employee Performance</Title>
        <Button type="primary" onClick={() => {
          setEditing(null);
          form.resetFields();
          setVisible(true);
        }}>
          Add Performance
        </Button>
      </Space>

      <Table
        dataSource={records}
        rowKey="_id"
        pagination={{ pageSize: 6 }}
        className="no-hover-table"
        columns={[
          { title: 'Employee', dataIndex: 'empName' },
          { title: 'Month', dataIndex: 'month' },
          { title: 'Year', dataIndex: 'year' },
          { title: 'Rating', dataIndex: 'rating' },
          { title: 'Remarks', dataIndex: 'remarks' },
          {
            title: 'Actions',
            render: (_, record) => (
              <Space>
                <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
              </Space>
            )
          }
        ]}
      />

      <AnimatePresence>
        {visible && (
          <Modal
            title={editing ? 'Edit Performance' : 'Add Performance'}
            open={visible}
            onCancel={() => {
              setVisible(false);
              form.resetFields();
              setEditing(null);
            }}
            footer={null}
            centered
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="empId" label="Employee" rules={[{ required: true }]}>
                  <Select placeholder="Select employee">
                    {employees.map(e => (
                      <Option key={e._id} value={e._id}>{e.name}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="month" label="Month" rules={[{ required: true }]}>
                  <Select placeholder="Select month">
                    {months.map(m => <Option key={m}>{m}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                  <Select placeholder="Select year">
                    {years.map(y => <Option key={y}>{y}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
                  <Select placeholder="Select rating">
                    {[1, 2, 3, 4, 5].map(n => <Option key={n}>{n}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item name="remarks" label="Remarks" rules={[{ required: true }]}>
                  <Select placeholder="Select remarks">
                    {remarksOptions.map(r => <Option key={r}>{r}</Option>)}
                  </Select>
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                  {editing ? 'Update' : 'Submit'}
                </Button>
              </Form>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PerformancePage;
