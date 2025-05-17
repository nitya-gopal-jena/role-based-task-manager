import Task from '../models/Task.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();
import { getCurrentUserRole, getCurrentUserId, ROLE_ADMIN, ROLE_USER } from '../utils/utils.js'



// Assign a tasks
export const assignTask = async (req, res) => {
  try {

    const currentUserId = getCurrentUserId(req);
    const currentUserRole = getCurrentUserRole(req);

    var { title, description, dueDate, createdById, assignToId, status } = req.body;
    createdById = currentUserId;

    const currentUser = await User.findById(currentUserId);
    const createdByName = currentUser.name;

    if (currentUserRole === ROLE_ADMIN) {
      if (assignToId == '') {
        return res.status(400).json({ message: 'Assigned user id is rerquired.' })
      }
    } else if (currentUserRole === ROLE_USER) {
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

    // Create notification AFTER task is saved
    await Notification.create({
      userId: assignToId,
      taskId: task._id,
      type: "task-added",
      message: `A new task "${title}" was assigned to you.`,

    });

    return res.status(200).json({ message: 'Task assign successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error when assign a task !', msg: error.message });
  }
};


// Fetch the tasks by id 
export const getTaskById = async (req, res) => {
  try {

    const currentUserId = getCurrentUserId(req);
    const currentUserRole = getCurrentUserRole(req);

    const taskId = req.params.id;
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (currentUserRole != ROLE_ADMIN) {
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



// Fetch all task lists with pagination
export const getAllTask = async (req, res) => {
  const queryParams = req.query;

  const title = queryParams.title;
  const description = queryParams.description;
  const userName = queryParams.userName;

  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 10;

  if (page <= 0 || limit <= 0) {
    return res.status(400).json({ message: 'Page and limit must be positive numbers.' });
  }

  const skip = (page - 1) * limit;

  let filters = {};

  if (title !== undefined) {
    filters.title = { $regex: title, $options: "i" };
  }
  if (description !== undefined) {
    filters.description = { $regex: description, $options: "i" };
  }
  if (userName !== undefined) {
    filters.assignToName = { $regex: userName, $options: "i" };
  }

  try {
    const currentUserRole = getCurrentUserRole(req);
    const currentUserId = getCurrentUserId(req);

    let taskQuery;
    if (currentUserRole === ROLE_ADMIN) {
      taskQuery = Task.find(filters);
    } else {
      taskQuery = Task.find({ assignToId: currentUserId });
    }

    const [alltask, total] = await Promise.all([
      taskQuery.skip(skip).limit(limit).sort({ createdAt: -1 }),
      currentUserRole === ROLE_ADMIN
        ? Task.countDocuments(filters)
        : Task.countDocuments({ assignToId: currentUserId })
    ]);

    res.status(200).json({
      message: 'Successfully fetch the tasks lists',
      alltask,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong when fetching tasks',
      msg: error.message
    });
  }
};


// Update the tasks
export const updateTaskById = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);
    const currentUserRole = getCurrentUserRole(req);
    let newAssignToId = req.body.assignToId;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(403).json({ message: 'Task not found' });
    }

    if (currentUserRole !== ROLE_ADMIN) {
      if (newAssignToId !== currentUserId) {
        return res.status(400).json({ message: 'Cannot update others\' tasks' });
      } else {
        newAssignToId = currentUserId;
      }
    }

    const user = await User.findById(newAssignToId);
    if (!user) {
      return res.status(400).json({ message: 'Assigned user not found!' });
    }

    // Fetch all old values before update
    const oldValues = {
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate?.toISOString(),
    };

    // Update fields explicitly
    task.title = req.body.title;
    task.description = req.body.description;
    task.assignToId = newAssignToId;
    task.assignToName = user.name;
    task.status = req.body.status;
    task.dueDate = req.body.dueDate;

    await task.save();

    // Create a notification for update task

    if (req.body.title && req.body.title !== oldValues.title) {
      await Notification.create({
        userId: task.assignToId,
        taskId: task._id,
        type: "task-updated",
        message: `Your task title was updated from "${oldValues.title}" to "${task.title}".`
      });
    };
    if (req.body.description && req.body.description !== oldValues.description) {
      await Notification.create({
        userId: task.assignToId,
        taskId: task._id,
        type: "task-updated",
        message: `Your task description was updated from "${oldValues.description}" to "${task.description}".`
      });
    };

    if (req.body.status && req.body.status !== oldValues.status) {
      await Notification.create({
        userId: task.assignToId,
        taskId: task._id,
        type: "task-updated",
        message: `Your task  "${task.title}" status updated from "${oldValues.status} to "${task.status}".`
      });
    };




    return res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    return res.status(500).json({ message: 'Error while updating the task', error: error.message });
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
    }

    if (currentUserRole != ROLE_ADMIN) {
      if (task.assignToId == currentUserId ){
        return res.status(200).json({ message: 'Task delete successfully' });
      } else {
        return res.status(400).json({ message: 'Can not delete any others tasks' });
      }
    }

    await Task.deleteOne({ _id: taskId })

    // Create notification AFTER task is saved
    await Notification.create({
      userId: task.assignToId,
      taskId: task._id,
      type: "task-deleted",
      message: `Your task "${task.title}" has been deleted.`,
    });


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
    const taskCount = await Task.countDocuments();
    return res.status(200).json({ totalNoOftask: taskCount });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong when fetching the number of tasks' });
  }
};



// Fetch the total no of tasks of current loged in user
export const fetchCurrentuserTasksNo = async (req, res) => {
  try {
    const currentUserId = getCurrentUserId(req);

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
    const currentUserId = getCurrentUserId(req);

    // Find the tasks where the assignToId id is equal to currentUserId
    const tasks = await Task.find({ assignToId: currentUserId });
    return res.status(200).json({ message: 'Current user tasks', tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch the current users tasks ' });
  }
};



