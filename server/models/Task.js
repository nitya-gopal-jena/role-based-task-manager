import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: false },
    assignTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    dueDate: { type: Date, required: false }

}, { timestamps: true });


const Task = mongoose.model('Task', taskSchema)
export default Task