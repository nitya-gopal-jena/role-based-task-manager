import User from '../models/User.js'
import Task from '../models/Task.js';


// Pagination for user list
export const userPagination = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments();

        return res.status(200).json({ total, pages: Math.ceil(total / limit), userdata: users })

    } catch (error) {
        return res.status(500).json({ message: 'Something wrong when get user page', error: error.message })
    }

}


// Pagination for task list
export const taskPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit

        const tasks = await Task.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })


        const total = await Task.countDocuments();
        return res.status(200).json({ total, pages: Math.ceil(total / limit), taskdata: tasks })


    } catch (error) {
        return res.status(500).json({ message: 'Something wrong when get task page', error: error.message })
    }
}