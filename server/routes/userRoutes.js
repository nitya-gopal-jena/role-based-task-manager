import express from 'express'
import { register, login, updateUserProfile, deleteProfile, allusers, getuser, getUserProfile } from "../controllers/userController.js";
import authenticateUser from '../middlewares/UserAuthenticator.js';

const router = express.Router()

// Create a register route 
router.post('/register', register)

// Create a login route
router.post('/login', login)

// Get users
router.get('/getusers', getuser)

// Get all users
router.get("/alluserlist", allusers

)

// Update profile
router.put('/update', updateUserProfile, authenticateUser)

// Delete profile
router.delete('/delete/:id', deleteProfile, authenticateUser)

// Get profile details
router.get('/profile', getUserProfile ,authenticateUser)

export default router