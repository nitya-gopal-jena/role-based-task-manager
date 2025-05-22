import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdEditSquare, MdDelete, MdSearch } from 'react-icons/md';
import { toast } from 'react-toastify';
import '../../styles/users/userlist.css';

const UserList = () => {
  const [userlist, setUserList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const USERS_PER_PAGE = 10;

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = `http://localhost:5000/api/users/alluserlist?page=${currentPage}&limit=${USERS_PER_PAGE}${searchQuery ? `&search=${searchQuery}` : ''}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserList(response.data.userdata);
        setPages(response.data.pages);
        setTotalUsers(response.data.total);
      } catch (error) {
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
        toast.error('failed to fetch total no of users', error);
      }
    };

    fetchTotalUsersNo();
    fetchUserList();
  }, [currentPage, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleEditUser = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

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

      toast.success(response.data.message);
      // Refresh current page data after deletion
      setUserList((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    }
  };

  // Next/Prev button for pagination
  const goToNextPage = () => {
    if (currentPage < pages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className='main-container'>
      <div className='user-table-container'>
        <div className='header-content'>
          <h3 className='users-title'>Users List</h3>
          <span className='users-no'>No of users: {totalUsers}</span>

          <div className='header-right'>
            {/* Search Bar */}
            <div className='search-container'>
              <div className='search-input-wrapper'>
                <MdSearch className='search-icon' />
                <input type='text' placeholder='Search tasks...' value={searchQuery} onChange={handleSearchChange} className='search-input' />
              </div>
            </div>
          </div>
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
                  <td className='sl-no'>{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <button className='edit-btn' onClick={() => handleEditUser(user._id)}>
                      <MdEditSquare className='edit-btn-icon' />
                    </button>
                  </td>
                  <td>
                    <button className='delete-btn' onClick={() => handleDeleteUser(user._id)}>
                      <MdDelete className='delete-btn-icon' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Buttons */}
        <div className='pagination-container'>
          <button className='pagination-btn' onClick={goToPrevPage} disabled={currentPage === 1}>
            Prev
          </button>
          <span className='pagination-info'>
            Page {currentPage} of {pages}
          </span>
          <button className='pagination-btn' onClick={goToNextPage} disabled={currentPage === pages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
