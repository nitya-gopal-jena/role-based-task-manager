import React from 'react';



const FetchRole = () => {
  const token = localStorage.getItem('token');
  const userRole = token.role;
  return userRole;
};

export default FetchRole;
