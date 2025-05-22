# 🗂️ Role-Based Task Management System

## A task management web application built using **Vite + React** with **role-based authentication**

## 🚀 Features

- 🔐 **Role-Based Authentication** (Admin, User)
- 🧑‍💼 **User Management** (Admin can add, edit, delete users)
- ✅ **Task Management** (Create, assign, update, delete tasks)
- 📢 Real-time notifications via Socket.IO
- ⏳ Auto-logout after inactivity
- 🔒 **Secure Password Handling**
- 🧠 Responsive and intuitive UI
- 🛡️ Secure API endpoints
- ⚡ Fast build with **Vite**

---

## 🛠️ Tech Stack

### 🎨 Frontend Tech Stack

| Tool / Technology       | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| **Vite**                | Fast build tool and dev server for React          |
| **React.js**            | UI library for building user interfaces           |
| **React Router DOM**    | Client-side routing                               |
| **React Toastify**      | Toast notifications for alerts                    |
| **Axios**               | API communication with backend                    |
| **CSS**                 | Styling the components                            |
| **Context API / Hooks** | State and authentication management               |
| **LocalStorage**        | Store auth tokens/user data in browser            |
| **Socket.IO Client**    | Real-time event handling (for live notifications) |
| **Responsive Design**   | Mobile-friendly layouts using CSS techniques      |

### 🧰 Backend Tech Stack

| Tool / Technology | Purpose                                     |
| ----------------- | ------------------------------------------- |
| **Node.js**       | JavaScript runtime environment              |
| **Express.js**    | Web framework for Node.js                   |
| **MongoDB**       | NoSQL database for storing users/tasks      |
| **Mongoose**      | ODM to interact with MongoDB                |
| **JWT**           | Secure authentication & token handling      |
| **bcrypt.js**     | Password hashing                            |
| **dotenv**        | Environment variable management             |
| **CORS**          | Cross-Origin Resource Sharing               |
| **Socket.IO**     | Real-time communication (for notifications) |

---


### 🔐 Roles & Permissions

| Role  | Permissions                             |
| ----- | --------------------------------------- |
| Admin | Full access to users and tasks          |
| User  | Can view and update assigned tasks only |

---

## 📌 Features & Functionalities (Step-by-Step)


### 1. 🔐 User Authentication & Authorization

- Users can **register** and **log in** with email/username and password.
- Passwords are **hashed** using bcrypt before saving to the database.
- JWT tokens are used to authenticate users and authorize routes.
- Roles assigned during registration or by Admin:
  - **Admin**
  - **User**
  - By default user role is User which can change by Admin later.

---

### 2. 👥 Role-Based Access Control (RBAC)

- **Admin**:
  - Manage all users (create, edit, delete, assign roles).
  - View and manage all tasks.
  - Create and assign tasks to users.
  - View tasks assigned by or to them.
- **User**:
  - View only their own tasks.
  - Update task status (e.g., In Progress, Completed).

---

### 3. 📋 Task Management

- Create, edit, delete tasks (based on role).
- Assign tasks to users with:
  - Title
  - Description
  - Status (Pending, In Progress, Completed)
  - Due Date

---

### 4. 📤 Real-Time Notifications

- Use **Socket.IO** for real-time alerts:
  - When a new task is assigned
  - When a task is updated
- Notifications displayed as **React Toasts**.

---

### 5. 🔒 Security Features

- Input validation on frontend and backend
- Protected routes with role checks
- CORS and rate limiting configured

---

### 6. 🧑‍💼 User Management (Admin Panel)

- Admin can:
  - View all registered users
  - Edit user details (name, email, role)
  - Delete users
- Pagination and search functionality for large user bases.

---

### 7. 🌐 Responsive Design

- Fully responsive UI for all screen sizes:
  - Desktop
  - Tablet
  - Mobile
- Mobile-friendly navigation (e.g., hamburger menu)

---
