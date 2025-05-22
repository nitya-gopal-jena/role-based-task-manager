import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import EditProfile from "./pages/users/EditProfile";
import ChangePassword from "./pages/users/ChangePassword";
import UpdateProfile from "./pages/users/UpdateProfile";
import PrivateRoute from "./components/private/PrivateRoute";
import PrivateAdminRoute from "./components/private/PrivateAdminRoue";
import Dashboard from "./pages/admin/Dashboard";
import UserList from "./pages/users/UserList";
import TasksList from "./pages/tasks/TasksList";
import EditTask from "./pages/tasks/EditTask";
import AddTask from "./pages/tasks/AddTask";
import UpdateUserProfile from "./pages/users/UpdateUserProfile";
import About from "./pages/About";

import "./styles/app.css";

const App = () => {
  return (
    <>
      <Router>
        <Layout>
          <div className="app-container">
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/home"
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/edit-profile"
                  element={
                    <PrivateRoute>
                      <EditProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <PrivateRoute>
                      <ChangePassword />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/update-profile"
                  element={
                    <PrivateRoute>
                      <UpdateProfile />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/edit-user/:userId"
                  element={
                    <PrivateRoute>
                      <UpdateUserProfile />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <PrivateAdminRoute>
                      <Dashboard />
                    </PrivateAdminRoute>
                  }
                />
                <Route
                  path="/all-users-list"
                  element={
                    <PrivateAdminRoute>
                      <UserList />
                    </PrivateAdminRoute>
                  }
                />
                <Route
                  path="/all-tasks-list"
                  element={
                    <PrivateAdminRoute>
                      <TasksList showUserTasks={false} />
                    </PrivateAdminRoute>
                  }
                />
                <Route
                  path="/my-tasks-list"
                  element={
                    <PrivateAdminRoute>
                      <TasksList showUserTasks={true} />
                    </PrivateAdminRoute>
                  }
                />

                <Route
                  path="/edit-task/:taskId"
                  element={
                    <PrivateAdminRoute>
                      <EditTask />
                    </PrivateAdminRoute>
                  }
                />
                <Route
                  path="/add-task"
                  element={
                    <PrivateAdminRoute>
                      <AddTask />
                    </PrivateAdminRoute>
                  }
                />

                <Route path="/about" element={<About/>} />
              </Routes>
            </div>
          </div>
        </Layout>
      </Router>
    </>
  );
};

export default App;
