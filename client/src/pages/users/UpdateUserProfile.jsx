import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/users/updateuserprofile.css';


const UpdateUserProfile = () => {
  const { userId } = useParams();
  const [error, setError] = useState('');
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/users/user-profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        toast.error('Failed to fetch user profile');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/users/update-profile/${userId}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response?.data?.message);
    } catch (error) {
      toast.error('Failed to update user profile', error.response?.data || error.message);
    }
  };

 

  return (
    <>
      <div className='update-user-wrapper'>
        <div className='update-user-container'>
          <form onSubmit={handleSubmit}>
            {error && <p className='error-message'>{error}</p>}

            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input type='text' className='form-input' placeholder='Name' name='name' value={user.name} onChange={handleChange} required />
            </div>

            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <input type='text' className='form-input' placeholder='Username' name='username' value={user.username} onChange={handleChange} required />
            </div>

            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type='email' className='form-input' placeholder='Email' name='email' value={user.email} onChange={handleChange} required />
            </div>

            <div className='form-group'>
              <label htmlFor='role'>Role</label>
              <select id='dropdown' name='role' value={user.role} onChange={handleChange}>
                <option value=''>-- Select --</option>
                <option value='admin'>Admin</option>
                <option value='user'>User</option>
              </select>
            </div>

            <button type='submit' className='save-btn'>
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateUserProfile;
