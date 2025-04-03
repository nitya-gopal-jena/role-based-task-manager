import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

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
                <Route path='/home' element={<Home />} />
              </Routes>
            </div>
          </div>
        </Layout>
      </Router>
    </>
  );
};

export default App;
