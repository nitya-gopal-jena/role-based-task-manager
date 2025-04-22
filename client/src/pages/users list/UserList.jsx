import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/userlist/userlist.css';

const UserList = () => {
  const [userlist, setUserList] = useState([]);
  const [error, setError] = useState('');

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
        setError('Failed to fetch user list.');
      }
    };

    fetchUserList();
  }, []);

  return (
    <div className='user-table-container'>
      <h2>Users</h2>
      {error && <p className='error-message'>{error}</p>}
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
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button className='edit-btn'>Edit</button>
              </td>
              <td>
                <button className='delete-btn'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
