import React from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
// import { toast } from 'react-toastify';

const ROLE_ADMIN = 'admin';
const ROLE_USER = 'user';


const getCurrentUserRole = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);
      return decoded.role;
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }
};

const getCurrentUserName = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);
      return decoded.username;
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }
};



export { getCurrentUserRole, getCurrentUserName, ROLE_ADMIN, ROLE_USER, };
