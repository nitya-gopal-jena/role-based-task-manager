# 🗂️ Role-Based Task Management System

## A task management web application built using **Vite + React** with **role-based authentication**

## 🚀 Features

- 🔐 **Role-Based Authentication** (Admin, User)
- 🧑‍💼 **User Management** (Admin can add, edit, delete users)
- ✅ **Task Management** (Create, assign, update, delete tasks)
- 🕒 **Auto Logout** on inactivity
- 🔒 **Secure Password Handling**
- ⚡ Fast build with **Vite**

---

## 🛠️ Tech Stack

### 🎨 Frontend Tech Stack

| Tool / Technology       | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| **Vite**                | Fast build tool and dev server for React |
| **React.js**            | UI library for building user interfaces  |
| **React Router DOM**    | Client-side routing                      |
| **React Toastify**      | Toast notifications for alerts           |
| **Axios**               | API communication with backend           |
| **CSS**                 | Styling the components                   |
| **Context API / Hooks** | State and authentication management      |
| **LocalStorage**        | Store auth tokens/user data in browser   |

### 🧰 Backend Tech Stack

| Tool / Technology | Purpose                                |
| ----------------- | -------------------------------------- |
| **Node.js**       | JavaScript runtime environment         |
| **Express.js**    | Web framework for Node.js              |
| **MongoDB**       | NoSQL database for storing users/tasks |
| **Mongoose**      | ODM to interact with MongoDB           |
| **JWT**           | Secure authentication & token handling |
| **bcrypt.js**     | Password hashing                       |
| **dotenv**        | Environment variable management        |
| **CORS**          | Cross-Origin Resource Sharing          |

---

## 🔐 Roles & Permissions

| Role  | Permissions                             |
| ----- | --------------------------------------- |
| Admin | Full access to users and tasks          |
| User  | Can view and update assigned tasks only |
