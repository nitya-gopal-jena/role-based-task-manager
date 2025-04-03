import React from 'react';
import '../styles/login.css'
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <>
      <div className="login-container">
      <div className='login-box'>
        <form action=''>
            <h3 className='login-title'>Login to your account</h3>
            <p className='login-description'>It's nice to see you again. Ready to manage your tasks?</p>

          <table>
            <tbody>
              <tr>
                <td>
                  <input type='text' placeholder='Enter Email' id='username' required />
                </td>
              </tr>

              <tr>
                <td>
                  <input type='password' placeholder='Enter Password' id='password' required />
                </td>
              </tr>

              <tr>
                <td>
                  <button type='submit' className='login-btn'>
                    Login
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p className='register-link'>
            Don't have an account ? <Link to='/register'>Register</Link>
          </p>
        </form>
      </div>
     </div>
    </>
  );
};

export default Login;
