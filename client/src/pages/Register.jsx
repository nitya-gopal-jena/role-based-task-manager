import { React, useState } from 'react';
import '../styles/register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target });
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);

      // setFormData({ name: '', username: '', email: '', password: '' })
      alert(response?.data?.messgae);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed!');
    }
  };
  return (
    <>
      <div className='register-container'>
        <div className='register-box'>
          <form onSubmit={handleSubmit}>
            <h3 className='register-title'>Create a account</h3>
            <p className='register-description'>Join our task management platform and stay organized !</p>

            <table>
              <tbody>
                <tr>
                  <td>
                    <input type='text' placeholder='Enter Full Name' id='name' name='name' onChange={handleChange} required />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input type='text' placeholder='Enter username' id='username' name='username' onChange={handleChange} required />
                  </td>
                </tr>

                <tr>
                  <td>
                    <input type='email' placeholder='Enter Email' id='email' name='email' onChange={handleChange} required />
                  </td>
                </tr>

                <tr>
                  <td>
                    <input type='password' placeholder='Enter password' id='password' name='password' onChange={handleChange} value={formData.password} required />
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
