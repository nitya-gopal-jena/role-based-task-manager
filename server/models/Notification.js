import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },

    type: {
        type: String,
        enum: ['task-added', 'task-updated', 'task-deleted'],
        required: true,
    },
    message: String,
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;