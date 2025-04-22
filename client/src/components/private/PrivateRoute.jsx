import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? children : <Navigate to='/' replace />; // Redirect to the login page
};

export default PrivateRoute;
