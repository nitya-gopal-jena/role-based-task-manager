import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/users/editprofile.css';

const EditProfile = () => {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    role: '',
  });

  const [error, setError] = useState('');

  // Fetch current user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (err) {
        toast.error('Failed to fetch user data.');
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <div className='profile-wrapper'>
        <div className='profile-container'>
          <div className='user-profile-header'>
            <h2 className='profile-title'>
              👤<span className='name'>{user.name}</span>
            </h2>
            <span className='profile-status'>
              <span className='status-dot'></span>
              {user.status}
            </span>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form>
            <div className='form-group'>
              <input type='text' className='form-input' placeholder='Full Name' name='name' value={user.name} required />
            </div>

            <div className='form-group'>
              <input type='text' className='form-input' placeholder='Username' name='username' value={user.username} required />
            </div>

            <div className='form-group'>
              <input type='email' className='form-input' placeholder='Email Address' name='email' value={user.email} required />
            </div>

            <div className='form-group'>
              <div className='modern-role-display'>
                <label htmlFor='role' className='role-label'>
                  Role
                </label>
                <span className='role-chip'>{user.role}</span>
              </div>
            </div>

            <div className='btn-group'>
              <Link to='/update-profile' className='update-btn'>
                Edit Profile
              </Link>
              <Link to='/change-password' className='change-password'>
                Change Password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
