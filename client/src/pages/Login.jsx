import { React, useState } from 'react';
import '../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';

const Login = () => {
  const [email, setUserEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });

      // Extract role from response
      const { token, username, role } = response.data;
   
      // Store login details in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);

      toast.success(response?.data?.message);

      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed!');
    }
  };

  return (
    <>
      <div className='login-container'>
        <div className='login-box'>
          <form onSubmit={handleSubmit}>
            <h3 className='login-title'>Login to your account</h3>
            <p className='login-description'>It's nice to see you again. Ready to manage your tasks?</p>

            <table>
              <tbody>
                <tr>
                  <td>
                    <input type='text' placeholder='Enter email or username' id='username' onChange={(e) => setUserEmail(e.target.value)} required />
                  </td>
                </tr>

                <tr>
                  <td>
                    <input type='password' placeholder='Enter Password' id='password' onChange={(e) => setPassword(e.target.value)} required />
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
