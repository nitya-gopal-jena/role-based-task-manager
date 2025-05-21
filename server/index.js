import express from 'express';
import connectDB from './config/db.js';
import { configDotenv } from 'dotenv'
configDotenv();
import cors from 'cors'
import { Server } from 'socket.io';
import {createServer} from 'http'

import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js'



const app = express();
const server = createServer(app);

const io = new Server(server)

io.on("connection", (socket) => {
  
})




// Middlewares API 
app.use(cors({ origin: "http://localhost:5173" })) // Integration of front-end to back-end
app.use(express.json())


// Authroutes 
app.use('/api/users', userRoutes)

// Taskroutes
app.use('/api/tasks', taskRoutes)





// import port and host from .env file
const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  connectDB(); // call database connection
});
