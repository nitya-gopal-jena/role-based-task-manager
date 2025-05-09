import express from 'express'
import { register, login, allUsersList, fetchUserProfileEdit, updateUserProfileEdit, changePassword } from "../controllers/userController.js";
import { deleteUserProfile, getTotalUsersNo, getUserIdandName, getUserProfileById, updateUserProfileById } from "../controllers/userController.js";
import authenticateUser from '../middlewares/UserAuthenticator.js';

const router = express.Router()


router.post('/register', register)
router.post('/login', login)

// Edit profile page 
router.get('/profile', fetchUserProfileEdit)
router.put('/change-password', changePassword )
router.put('/update-profile/edit', updateUserProfileEdit)

// User list page 
router.get("/alluserlist", allUsersList)
router.get('/users-name', getUserIdandName)
router.get('/usercount', getTotalUsersNo)
router.get('/user-profile/:id', getUserProfileById)
router.put('/update-profile/:id', updateUserProfileById, authenticateUser)
router.delete('/userdelete/:id', deleteUserProfile);



export default router