import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in environment variables");
    }

    return jwt.sign(
        { id: user._id, username: user.username, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2h' } 
    );
};

export default generateToken;
