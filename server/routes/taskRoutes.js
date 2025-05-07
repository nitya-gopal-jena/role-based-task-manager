import express from 'express'
import { getAllTask, assignTask, deleteTask, getTaskById } from '../controllers/taskController.js'
import { totalNoOftask, fetchCurrentuserTasksNo, updateTaskById, fetchCurrentuserTasks } from '../controllers/taskController.js'

const router = express.Router()


router.get("/", getAllTask)  // Fetch all tasks
router.get('/mytasks', fetchCurrentuserTasks)
router.get('/mytaskscount', fetchCurrentuserTasksNo)
router.get("/:id", getTaskById)  // Fetch task by id
router.get('/count/all', totalNoOftask)  // Fetch total no of task
router.get('/count/user', fetchCurrentuserTasksNo)  // Fetch current user task no
router.post("/", assignTask)    // Create a task
router.put('/:id', updateTaskById)  // Update task by id
router.delete("/:id", deleteTask)   // Delete task by id






export default router

