import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: false },
    status: { type: String, enum: ['pending', 'In progress', 'completed'], default: 'pending' },
    assignToId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignToName: { type: String },
    createdTime: { type: Date, required: false },
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: { type: String },
    updatTime: { type: Date, required: false },
    updatedById: { type: String },
    updatedByName: { type: String }
}, { timestamps: true });


const Task = mongoose.model('Task', taskSchema)
export default Task