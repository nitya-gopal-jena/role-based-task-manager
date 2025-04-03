import Task from '../models/Task.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
configDotenv()

// Assign a task
export const assignTask = async (req, res) => {
    try {

        const { title, description, deadline, assignBy, assignTo, status } = req.body;
        // Check if task already assign or not
        const user = await User.findById(assignTo);
        if (!user) {
            return res.status(401).json({ message: 'Assign user not found !' });
        }

        // Craete a new task
        const task = new Task({
            title,
            description,
            assignTo,
            assignBy,
            status,
            deadline,
        });

        await task.save();
        return res.status(200).json({ message: 'Task assign successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error when assign a task !', msg: error.message });
    }
};


// Get tasks assign to a user
export const getUserTask = async (req, res) => {
    try {

        const userName = req.query.userName;
        // Find the user by name 
        const user = await User.findOne({ name: userName });

        if (!user) {
            return res.status(401).json({ message: `user with name ${userName} not found` })
        }
        const tasks = await Task.findOne({ assignTo: user.id })

        if (!tasks) {
            return res.status(401).json({ message: 'Task not assign' });
        }

        return res.status(200).json({ message: "Task fetching successfully", tasks });


    } catch (error) {
        return res.status(500).json({ message: 'Error when fetching user task' });
    }
};


// Get all task 
export const allTask = async (req, res) => {
    try {

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized:Token not provided" })
        }

        const secretKey = process.env.JWT_SECRET  // import the secret key from .env

        const decoded = jwt.verify(token, secretKey) // verify the token

        const role = decoded.role // Extract the role from token
        const userId = decoded.id // Extract the id of current user

        if (role === "admin") {

            const alltask = await Task.find();
            res.status(200).json({ message: 'success', alltask });

        } else {
            const currentUserTask = await Task.findOne({ assignTo: userId })
            return res.status(200).json({ message: "success", currentUserTask })
        }

    } catch (error) {
        res.status(500).json({ message: 'error', msg: error.message });
    }
};



// Update the task 
export const updateTask = async (req, res) => {
    try {



    } catch (error) {
        return res.status(500).json({ message: "Error while update the task" })
    }
}




// Delete Task
export const deleteTask = async (req, res) => {

    try {
        const userName = req.query.userName
        const user = await User.findOne({ userName })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const tasks = await Task.findOneAndDelete({ assignTo: user._id })
        if (!tasks) {
            return res.status(404).json({ message: "Task not assign" })
        }

        return res.status(200).json({ message: "Task delete successfully" })

    } catch (error) {
        return res.status(500).json({ message: "Error while delete the task" })
    }
}


