import express from 'express';
import connectDB from './config/db.js';
import { configDotenv } from 'dotenv'
configDotenv();
import cors from 'cors'
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js'


const app = express();

// Middlewares API 
app.use(cors())
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
