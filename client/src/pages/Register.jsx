import React from 'react';
import '../styles/register.css'
import { Link } from 'react-router-dom';


const Register = () => {
  return (
    <>
      <div className="register-container">
      <div className='register-box'>
        <form action=''>
            <h3 className='register-title'>Create a account</h3>
            <p className='register-description'>Join our task management platform and stay organized !</p>

          <table>
            <tbody>
              <tr>
                <td>
                  <input type='text' placeholder='Enter Full Name' id='name' required />
                </td>
              </tr>
              <tr>
                <td>
                  <input type='text' placeholder='Enter username' id='username' required />
                </td>
              </tr>

              <tr>
                <td>
                  <input type='email' placeholder='Enter Email' id='email' required />
                </td>
              </tr>

              <tr>
                <td>
                  <input type='password' placeholder='Enter password' id='pasword' required />
                </td>
              </tr>

              <tr>
                <td>
                  <label for='role' id='choose-role'>
                    Choose Role:
                  </label>
                  <select id='role' name='role'>
                    <option value='user'  className='option-value'>User</option>
                    <option value='admin' className='option-value'>Admin</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>
                  <button type='submit' className='register-btn'>
                    Register
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p className='login-link'>
            Have an account ? <Link to='/'>Login</Link>
          </p>

        </form>
      </div>
    </div>
    </>
  );
};

export default Register;
