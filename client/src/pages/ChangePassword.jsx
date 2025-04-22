import React from 'react';
import '../styles/changepass.css';

const ChangePassword = () => {
  return (
    <>
      <div className='password-wrapper'>
        <div className='password-container'>
          <h2 className='password-title'>Change Password</h2>
          <form action=''>
            <div className='form-group'>
              <input type='password' className='form-input' placeholder='Current Password' required />
            </div>
            <div className='form-group'>
              <input type='password' className='form-input' placeholder='New Password' required />
            </div>

            <div className='form-group'>
              <input type='password' className='form-input' placeholder='Confirm Password' required />
            </div>

            <button type='submit' className='pass-btn'>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
