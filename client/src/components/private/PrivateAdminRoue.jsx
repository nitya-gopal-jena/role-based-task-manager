import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? children : <Navigate to='/' replace />; 
};

export default PrivateAdminRoute;
