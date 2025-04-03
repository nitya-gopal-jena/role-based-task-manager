import express from 'express'
import { register, login, updateUserProfile, getuser, deleteProfile, allUser } from "../controllers/userController.js";

const router = express.Router()

// Create a register route 
router.post('/register', register)

// Create a login route
router.post('/login', login)

// Get users
router.get('/getusers', getuser)

// Get all users
router.get("/alluser", allUser )

// Update profile
router.put('/update/:id', updateUserProfile)

// Delete profile
router.delete('/delete/:id', deleteProfile)

export default router