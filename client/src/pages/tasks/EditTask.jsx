import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/tasks/edittask.css';
import axios from 'axios';

const EditTask = () => {
  const { taskId } = useParams();
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const navigate = useNavigate();
  
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignToId: '',
    status: '',
    dueDate: '',
    createdByName: '',
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTask(response.data.task);
        setSelectedUserId(response.data.task.assignToId);
      } catch (error) {
        toast.error('Failed to fetch task data');
      }
    };

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
        toast.error('Failed to fetch users');
      }
    };

    fetchTask();
    fetchUsers();
  }, [taskId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));

    if (name === 'assignToId') {
      setSelectedUserId(value);
    }
  };

  // Update the task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Task updated successfully!');
      navigate('/all-tasks-list');
      navi;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update task');
    }
  };

  return (
    <>
      <div className='task-wrapper'>
        <div className='task-container'>
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
                <option value=''>-- Select User --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='status'>Status</label>
              <select id='dropdown' value={task.status} name='status' onChange={handleChange}>
                <option value=''>-- Select --</option>
                <option value='pending'>Pending</option>
                <option value='In progress'>In Progress</option>
                <option value='completed'>Completed</option>
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='duedate'>Due Date</label>
              <input type='date' className='form-input' placeholder='Due date' name='dueDate' value={task.dueDate?.slice(0, 10) || ''} onChange={handleChange} required />
            </div>

            <div className='form-group'>
              <label htmlFor='createdby'>Created By Name</label>
              <input type='text' className='form-input' placeholder='Created by name' name='createdby' value={task.createdByName} disabled />
            </div>

            <button type='submit' className='task-save-btn'>
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditTask;
