import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserList from '../users list/UserList';
import { IoMdLogOut } from 'react-icons/io';
import '../../styles/dashboard/dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive tab from URL
  const isUserList = location.pathname.includes('all-users-list');

  // Button handlers to navigate
  const handleDashboardClick = () => {
    navigate('/admin/dashboard');
  };

  const handleUserListClick = () => {
    navigate('/admin/dashboard/all-users-list');
  };

  return (
    <div className='dashboard-main-container'>
      <div className='dashboard-container'>
        <div className='sidebar'>
          <h2 className='logo'>Admin</h2>

          <div className='sidebar-menu'>
            <button onClick={handleDashboardClick}>Dashboard</button>
            <button onClick={handleUserListClick}>Users List</button>
          </div>

          <div className='logout-button'>
            <Link to='/'>
              <IoMdLogOut className='logout-icon' />
              Logout
            </Link>
          </div>
        </div>

        <div className='main-content'>
          {!isUserList ? (
            <div className='dashboard-content'>
              <div className='card'>Total Users: 120</div>
              <div className='card'>Active Sessions: 45</div>
              <div className='card'>Server Status: ✅ Online</div>
            </div>
          ) : (
            <div className='user-list-scroll'>
              <UserList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
