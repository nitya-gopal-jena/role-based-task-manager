import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/users/updateprofile.css'

const UpdateProfile = () => {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
},[])


  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  //   Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/update-profile/edit`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     toast.success('User profile updated successfully!');
      navigate('/edit-profile');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update user.');
    } finally {
    }
  };

  return (
    <>
      <div className='profile-wrapper'>
        <div className='profile-container'>
          <h2 className='update-title'>Update Profile</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <input type='text' className='form-input' placeholder='Full Name' name='name' value={user.name} onChange={handleChange} />
            </div>

            <div className='form-group'>
              <input type='text' className='form-input' placeholder='Username' name='username' value={user.username} onChange={handleChange} />
            </div>

            <div className='form-group'>
              <input type='email' className='form-input' placeholder='Email Address' name='email' value={user.email} onChange={handleChange} />
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

export default UpdateProfile;
