import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/users/changepass.css';

const ChangePassword = () => {
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('The new password and the confirm password must be the same');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/users/change-password',
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      navigate('/edit-profile');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <>
      <div className='password-wrapper'>
        <div className='password-container'>
          <h2 className='password-title'>Change Password</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <input type='password' className='form-input' placeholder='Current Password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className='form-group'>
              <input type='password' className='form-input' placeholder='New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>

            <div className='form-group'>
              <input type='password' className='form-input' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <button type='submit' className='pass-btn'>
              Change Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
