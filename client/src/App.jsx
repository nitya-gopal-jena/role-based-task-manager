import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import UpdateProfile from './pages/UpdateProfile';
import PrivateRoute from './components/private/PrivateRoute';
import Dashboard from './pages/admin/Dashboard';
import UserList from './pages/users list/UserList';

import './styles/app.css';

const App = () => {
  return (
    <>
      <Router>
        <Layout>
          <div className='app-container'>
            <div className='main-content'>
              <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route
                  path='/home'
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/edit-profile'
                  element={
                    <PrivateRoute>
                      <EditProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/change-password'
                  element={
                    <PrivateRoute>
                      <ChangePassword />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/update-profile'
                  element={
                    <PrivateRoute>
                      <UpdateProfile />
                    </PrivateRoute>
                  }
                />

                <Route path='/admin/dashboard' element={<Dashboard />} />
                <Route path='/admin/dashboard/all-users-list' element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </Layout>
      </Router>
    </>
  );
};

export default App;
