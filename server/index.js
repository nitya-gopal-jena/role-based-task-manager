import express from 'express';
import connectDB from './config/db.js';
import { configDotenv } from 'dotenv'
configDotenv();
import cors from 'cors'
import { Server } from 'socket.io';
import { createServer } from 'http'

import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join user's personal room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Join admin room
  socket.on("joinAdmin", () => {
    socket.join("admin");
    console.log("Admin joined admin room");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Make io accessible to our routes
app.set('io', io);

// Middlewares API 
app.use(cors({ origin: "http://localhost:5173" })) // Integration of front-end to back-end
app.use(express.json())

// Authroutes 
app.use('/api/users', userRoutes)

// Taskroutes
app.use('/api/tasks', taskRoutes)

// Notification routes
app.use('/api/notifications', notificationRoutes)

// import port and host from .env file
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;

server.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  connectDB(); // call database connection
});
