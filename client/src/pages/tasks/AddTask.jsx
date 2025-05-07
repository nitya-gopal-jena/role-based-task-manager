import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../../styles/tasks/addtask.css';

const AddTask = () => {
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: '',
    description: '',
    assignToId: '',
    status: 'pending',
    dueDate: '',
    createdByName: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users//users-name', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data.users);
      } catch (error) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    if (name === 'assignToId') {
      setSelectedUserId(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        {
          ...task,
          assignToId: selectedUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Task assigned successfully!');
      navigate('/all-tasks-list');
    } catch (error) {
      console.error(error);
      setError('Failed to add task');
    }
  };

  return (
    <>
      <div className='add-task-wrapper'>
        <div className='add-task-container'>
          <form onSubmit={handleSubmit}>
            {error && <p className='error-message'>{error}</p>}

            <div className='form-group'>
              <label htmlFor='title'>Title</label>
              <input type='text' className='form-input' placeholder='Title' name='title' value={task.title} onChange={handleChange} required />
            </div>

            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <input type='text' className='form-input' placeholder='Description' name='description' value={task.description} onChange={handleChange} required />
            </div>

            <div className='form-group'>
              <label htmlFor='assignToId'>Assign To Name</label>
              <select id='dropdown' value={selectedUserId} name='assignToId' onChange={handleChange}>
                <option value='select'>-- Select User --</option>
                {users.map((user) => (
                  <option value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='duedate'>Due Date</label>
              <input type='date' className='form-input' placeholder='Due date' name='dueDate' value={task.dueDate?.slice(0, 10) || ''} onChange={handleChange} required />
            </div>

            <button type='submit' className='task-add-btn'>
              Add Task
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTask;
