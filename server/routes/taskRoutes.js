import express from 'express'
import { allTask, assignTask, getUserTask, deleteTask } from '../controllers/taskController.js'

const router = express.Router()



// Create a router for assign tasks 
router.post("/assigntasks", assignTask)

// Create a router for get user tasks 
router.get("/usertasks", getUserTask)

// Create a router for get all users tasks
router.get("/alltasks", allTask)

// Create a router for delete task
router.delete("/delete", deleteTask)
export default router