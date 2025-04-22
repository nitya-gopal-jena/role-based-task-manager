import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateToken from '../utils/token.js';

// Registration controller
export const register = async (req, res) => {
    try {
        const { name, username, email, password, role } = req.body;

        // Check if user exist or not
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ messgae: 'User already exists !' });
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({ name, username, email, role, password: hashedPassword });
        newUser.save();

        return res.status(200).json({ messgae: 'Registration Successful !' });
    } catch (error) {
        return res.status(500).json({ messgae: 'Error when register !', error });
    }
};

// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exist or not
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found !' });
        }

        // Check if password correct or not
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credential !' });
        }

        // Generate the jwt token
        const token = generateToken(user);

        return res.status(200).json({ messgae: 'Login successful !', token, username: user.username });
    } catch (error) {
        return res.status(500).json({ message: 'Error while login ', error });
    }
};

// Get users
export const getuser = async (req, res) => {
    try {
        const user = await User.find();
        if (user) {
            return res.status(200).json({ message: 'success', user });
        }
    } catch (error) {
        return res.status(500).json({ messgae: 'Something went wrong when get user !' });
    }
};


// Get all users
export const allusers = async (req, res) => {
    try {
        const user = await User.find();
        if (user) {
            return res.status(200).json({ message: 'success', user });
        }
    } catch (error) {
        return res.status(500).json({ messgae: 'Something went wrong when get user !' });
    }
};

// Update users profile
export const updateUserProfile = async (req, res) => {
    try {

        // Extract token from hedaers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }

        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userIdFromToken = decoded.id;
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token !" })
        }

        // Find the user in the database from token id
        const user = await User.findById(userIdFromToken);
        if (!user) {
            return res.status(404).json({ messgae: 'user not found!' });
        }

        // Ensure only user can update their own profile
        if (!userIdFromToken) {
            return res.status(403).json({ messgae: 'Forbidden: You can only update your own profile ' });
        }

        // Create an object for update fields
        const updateFields = {
            name: req.body.name || user.name,
            username: req.body.username || user.username,
            email: req.body.email || user.email,
            role: req.body.role || user.role,
            password: user.password,
        };

        // If a new password is provided, hash it and update
        if (req.body.password) {
            updateFields.password = await bcrypt.hash(req.body.password, 10);
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(userIdFromToken, updateFields, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
    } catch (error) {
        return res.status(500).json({ messgae: 'Something went wrong when update !' });
    }
};


// Delete the users
export const deleteProfile = async (req, res) => {
    try {
        const user = await User.findOneAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({ message: 'User not exists !' });
        }
        return res.status(200).json({ message: 'User delete successfully !' });
    } catch (error) {
        return res.status(500).json({ message: 'Smoething wrong when delete !' });
    }
};


// Get user profile details
export const getUserProfile = async (req, res) => {
    try {
        // Extract token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }

        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userIdFromToken = decoded.id;
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token !" })
        }

        // Find the user details in the database
        const user = await User.findById(userIdFromToken);
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Return the user's profile information
        return res.status(200).json({ message: 'Profile fetched successfully', user });

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong when fetching the profile!' })
    }
}
