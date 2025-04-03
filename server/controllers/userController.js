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


// Get all task 
export const allUser = async (req, res) => {
    try {
        const alluser = await User.find();
        if (alluser) {
            res.status(200).json({ message: 'success', alluser });
        }
       
    } catch (error) {
        res.status(500).json({ message: 'error', msg:error.messgae });
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

        // Extract the user Id from the database
        const userIdFromDatabase = req.params.id;

        // Find the user in the database
        const user = await User.findById(userIdFromDatabase);
        if (!user) {
            return res.status(404).json({ messgae: 'user not found!' });
        }


        // Ensure only user can update their own profile
        if (userIdFromToken !== userIdFromDatabase) {
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
        const updatedUser = await User.findByIdAndUpdate(userIdFromDatabase, updateFields, {
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
