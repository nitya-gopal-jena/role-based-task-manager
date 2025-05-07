import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/dashboard/dashboard.css';
import { getCurrentUserRole, ROLE_ADMIN, ROLE_USER } from '../../utils/Utils';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [myTask, setMytask] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTask, setTotalTask] = useState(0);

  useEffect(() => {
    // Fetch the total no of users
    const fetchTotalUsersNo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/usercount', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalUsers(response.data.totalUsers);
      } catch (error) {
        console.log('failed to fetch total no of users', error);
      }
    };

    // Fetch the total no of tasks
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

    // Fetch the total number of tasks assigned to the currently logged-in user
    const fetchCurrentUserTaskNo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tasks/mytaskscount', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMytask(response.data.totalNoTasks);
      } catch (error) {
        console.log('Failed to fetch total no of tasks of current user');
      }
    };

    fetchCurrentUserTaskNo();
    fetchTotalUsersNo();
    fetchTotalTasksNo();
  }, []);


  const totalUsersList = (e) => {
    e.preventDefault();
    navigate('/all-users-list');
  };

  const totalTasksList = (e) => {
    e.preventDefault();
    navigate('/all-tasks-list');
  };

  const myTaskList = (e) => {
    e.preventDefault();
    navigate('/my-tasks-list');
  }


  return (
    <div className='dashboard-main-container'>
      <div className='dashboard-container'>
        <div className='main-content'>
          <div className='dashboard-content'>
            {getCurrentUserRole() === ROLE_ADMIN && (
              <div className='dashboard-content'>
                <div className='card' onClick={totalUsersList}>
                  Total Users : {totalUsers}
                </div>
                <div className='card' onClick={totalTasksList}>
                  Total Tasks : {totalTask}
                </div>
              </div>
            )}

            {getCurrentUserRole() === ROLE_USER && (
              <div className='user-cards'>
                <div className='card' onClick={myTaskList}>My Task : {myTask}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
