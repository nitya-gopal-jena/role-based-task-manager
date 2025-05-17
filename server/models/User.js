import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true, },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
        profilePicture: { type: String },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        isverified: { type: Boolean, default: false },
        verificationcode: { type: String },
    },
    { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
