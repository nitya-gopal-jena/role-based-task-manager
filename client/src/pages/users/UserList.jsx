import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdEditSquare } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import '../../styles/userlist/userlist.css';

const UserList = () => {
  const [userlist, setUserList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch all user list
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/alluserlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserList(response.data.user);
      } catch (err) {
        setError('Failed to fetch user list: Admin only');
      }
    };

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

    fetchTotalUsersNo();
    fetchUserList();
  }, []);

  // Function to navigate to edit task page
  const handleEditUser = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  // Delete the users profile from database
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/users/userdelete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error?.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className='main-container'>
      <div className='user-table-container'>
        <div className='header-content'>
          <h3 className='users-title'>Users List</h3>
          <span className='users-no'>No of users: {totalUsers}</span>
        </div>
        <hr />
        {error && <p className='error-message'>{error}</p>}
        <div className='table-wrapper'>
          <table className='user-table'>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th colSpan='2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userlist.map((user, index) => (
                <tr key={user._id || index}>
                  <td className='sl-no'>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <button  className='edit-btn' onClick={() => handleEditUser(user._id)}>
                      <MdEditSquare className='edit-btn-icon' />
                    </button>
                  </td>
                  <td>
                    <button  className='delete-btn' onClick={() => handleDeleteUser(user._id)}>
                      <MdDelete className='delete-btn-icon' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
