import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserRole, ROLE_ADMIN, ROLE_USER } from '../../utils/Utils';
import '../../styles/tasks/taskslist.css';

const TasksList = ({ showUserTasks = false }) => {
  const [taskslist, setTasksList] = useState([]);
  const [error, setError] = useState('');
  const [totalTask, setTotalTask] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalTasksNo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tasks/count/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTotalTask(response.data.totalNoOftask);
      } catch (error) {
        console.log('Failed to fetch the no of tasks', error);
      }
    };

    const fetchTasksList = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = showUserTasks ? 'http://localhost:5000/api/tasks/mytasks' : 'http://localhost:5000/api/tasks/';

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tasks = showUserTasks ? response.data.tasks : response.data.alltask;

        setTasksList(tasks);
        setTotalTask(tasks.length);
      } catch (error) {
        setError(showUserTasks ? 'Failed to load your tasks.' : 'Failed to fetch tasks list.');
      }
    };

    fetchTotalTasksNo();
    fetchTasksList();
  }, []);

  // Delete the task  from database
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task ?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
      // window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error?.response?.data?.message || 'Failed to delete task');
    }
  };

  // Function to navigate to edit task page
  const editTask = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  const addTask = (e) => {
    e.preventDefault();
    navigate('/add-task');
  };

  return (
    <>
      <div className='main-container'>
        <div className='task-table-container'>
          <div className='header-content'>
            <h3 className='task-title'>{showUserTasks ? 'My Tasks' : 'All Tasks'}</h3>
            <span className='task-no'>No of tasks: {totalTask}</span>

            {getCurrentUserRole() === ROLE_ADMIN && !showUserTasks && (
              <button className='add-task-btn' onClick={addTask}>
                Add Task
              </button>
            )}
          </div>
          <hr />
          {error && <p className='error-message'>{error}</p>}
          <div className='table-wrapper'>
            <table className='task-table'>
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Assign To</th>
                  <th>Created By</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th colSpan='2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {taskslist.map((alltask, index) => (
                  <tr key={alltask._id || index}>
                    <td className='sl-no'>{index + 1}</td>
                    <td>{alltask.title}</td>
                    <td>{alltask.description}</td>
                    <td>{alltask.assignToName}</td>
                    <td>{alltask.createdByName}</td>
                    <td>{alltask.status}</td>
                    <td>{alltask.dueDate?.slice(0, 10)}</td>
                    <td>
                      <button className='edit-btn' onClick={() => editTask(alltask._id)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button className='delete-btn' onClick={() => handleDeleteTask(alltask._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TasksList;
