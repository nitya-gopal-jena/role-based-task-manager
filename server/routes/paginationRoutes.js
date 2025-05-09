import express from 'express'
import { userPagination, taskPagination } from "../controllers/paginationController.js";

const router = express.Router();


// Users
router.get('/user-pagination', userPagination); 

// Tasks
router.get('/task-pagination', taskPagination);




export default router; 