import Task from '../models/Task.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();
import { getCurrentUserRole, getCurrentUserId, ROLE_ADMIN, ROLE_USER } from '../utils/utils.js'



// Assign a tasks
export const assignTask = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token not provide' })
    }

    // Verify token and extract id from token 
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decodedToken.id;
    var { title, description, dueDate, createdById, assignToId, status } = req.body;
    createdById = currentUserId;
    const createdByName = decodedToken.username;
    if (decodedToken.role === 'admin') {
      if (assignToId == '') {
        return res.status(400).json({ message: 'Assigned user id is rerquired.' })
      }
    } else if (decodedToken.role === 'user') {
      assignToId = currentUserId;
    }


    // Check if task already assign or not
    const user = await User.findById(assignToId);
    if (!user) {
      return res.status(400).json({ message: 'Assign user not found !' });
    }
    const assignToName = user.name;

    // Craete a new task
    const task = new Task({
      title,
      description,
      dueDate,
      assignToId,
      assignToName,
      createdById,
      createdByName,
      status,

    });

    await task.save();
    return res.status(200).json({ message: 'Task assign successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error when assign a task !', msg: error.message });
  }
};


// Fetch the tasks by id 
export const getTaskById = async (req, res) => {
  try {

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token not provide' });
    }

    // Verify the token 
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decodedToken.id;
    const currentUserRole = decodedToken.role;
    const taskId = req.params.id;
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (currentUserRole != 'admin') {
      if (task.assignToId == currentUserId) {
        return res.status(200).json({ message: 'Task fetched successfully', task });
      } else {
        return res.status(400).json({ message: 'Can not see task assigned to someone else' });
      }
    }
    return res.status(200).json({ message: 'Task fetched successfully', task });

  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong when fetch tasks', message: error.message })
  }
}

// Fetch tasks assign to a user
export const getUserTask = async (req, res) => {
  try {
    const userName = req.query.userName;
    // Find the user by name
    const user = await User.findOne({ name: userName });

    if (!user) {
      return res.status(401).json({ message: `user with name ${userName} not found` });
    }
    const tasks = await Task.findOne({ assignToId: user.id });

    if (!tasks) {
      return res.status(401).json({ message: 'Task not assign' });
    }

    return res.status(200).json({ message: 'Task fetching successfully', tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Error when fetching user task' });
  }
};


// Fetch all task lists
export const getAllTask = async (req, res) => {
  const queryParams = req.query;

  const title = queryParams.title;
  const description = queryParams.description;
  const userName = queryParams.userName;

  console.log('title-->', title)
  console.log('description-->', description)
  console.log('userName-->', userName)
  let filters = {};

  if (title != undefined) {
    filters.title = { $regex: title, $options: "i" };
  }
  if (description != undefined) {
    filters.description = { $regex: description, $options: "i" };
  }
  if (userName != undefined) {
    filters.assignToName = { $regex: userName, $options: "i" };
  }
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized:Token not provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userRole = decodedToken.role;
    const currentUserId = decodedToken.id;
    var alltask = '';
    if (userRole == 'admin') {
      alltask = await Task.find(filters);
    } else {
      alltask = await Task.find({ assignToId: currentUserId })
    }

    // Fetch all tasks

    res.status(200).json({ message: 'success', alltask });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong when fetch all tasks', msg: error.message });
  }
};


// Update the tasks
export const updateTaskById = async (req, res) => {
  try {

    const currentUserId = getCurrentUserId(req);
    const currentUserRole = getCurrentUserRole(req);
    let newAssignToId = req.body.assignToId;
    const taskId = req.params._id;

    const task = await Task.findOne(taskId)
    if (!task) {
      return res.status(403).json({ message: 'Task not found' })
    }


    if (currentUserRole != ROLE_ADMIN) {
      if (newAssignToId != currentUserId) {
        return res.status(400).json({ message: 'Can not update any others tasks' });
      } else {
        newAssignToId = currentUserId
      }
    }


    const user = await User.findOne({ _id: newAssignToId });
    if (!user) {
      return res.status(400).json({ message: 'Assign user not found !' });
    }


    Object.assign(task, req.body);

    task.assignToName = user.name

    await task.save();

    return res.status(200).json({ message: 'Task updated successfully', task });

  } catch (error) {
    return res.status(500).json({ message: 'Error while update the task', message: error.message });
  }
};


// Delete Tasks 
export const deleteTask = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);
    const currentUserRole = getCurrentUserRole(req);
    const taskId = req.params.id;
    const task = await Task.findById(taskId)
    if (!task) {
      return res.status(200).json({ message: 'Task not found' })
    } else {
      await Task.deleteOne({ _id: taskId });
    }

    if (currentUserRole != ROLE_ADMIN) {
      if (task.assignToId == currentUserId) {
        return res.status(200).json({ message: 'Task delete successfully' });
      } else {
        return res.status(400).json({ message: 'Can not delete any others tasks' });
      }
    }

    return res.status(200).json({ message: 'Task delete successfully' })

  } catch (error) {
    return res.status(500).json({ message: 'Error while delete the task' });
  }
};



// Fetch the total no of tasks(number)
export const totalNoOftask = async (req, res) => {
  try {
    if (getCurrentUserRole(req) !== ROLE_ADMIN) {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }
    console.log('hello')
    const taskCount = await Task.countDocuments();
    return res.status(200).json({ totalNoOftask: taskCount });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong when fetching the number of tasks' });
  }
};






// Fetch the total no of tasks of current loged in user
export const fetchCurrentuserTasksNo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    // Verify the token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decodedToken.id;

    // Count the number of tasks assigned to the current user
    const totalNoTasks = await Task.countDocuments({ assignToId: currentUserId });

    return res.status(200).json({ totalNoTasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong when fetching the current user number of tasks' });
  }
};



// Fetch the tasks assigned to users who are currently logged in
export const fetchCurrentuserTasks = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token not provide' });
    }

    
    // Verify the token and extract the id
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decodedToken.id;

    // Find the tasks where the assignToId id is equal to currentUserId
    const tasks = await Task.find({ assignToId: currentUserId });
    return res.status(200).json({ message: 'Current user tasks', tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch the current users tasks ' });
  }
};



