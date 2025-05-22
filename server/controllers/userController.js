import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateToken from '../utils/token.js';
import { getCurrentUserRole, getCurrentUserId, ROLE_ADMIN, ROLE_USER } from '../utils/utils.js'



// Registration controller
export const register = async (req, res) => {
    try {
        const { name, username, email, password, role } = req.body;

        if (!password || password.length < 6 || password.length > 20) {
            return res.status(400).json({ message: 'Password must be between 6 and 20 characters' });
        }

        // Check if user exist or not
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists !' });
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({ name, username, email, role, password: hashedPassword });
        newUser.save();

        return res.status(200).json({ message: 'Registration Successful !' });
    } catch (error) {
        return res.status(500).json({ message: 'Error when register !', error });
    }
};


// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exist or not
        const user = await User.findOne({ $or: [{ email }, { username: email }] });
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

        return res.status(200).json({ message: 'Login successful !', token, username: user.username, role: user.role });
    } catch (error) {
        return res.status(500).json({ message: 'Error while login ', error });
    }
};


// Fetch all users list with pagination
export const allUsersList = async (req, res) => {
    try {
        if (getCurrentUserRole(req) !== ROLE_ADMIN) {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.search;

        if (page <= 0 || limit <= 0) {
            return res.status(400).json({ message: 'Page and limit must be positive numbers.' });
        }

        const skip = (page - 1) * limit;

        let filters = {};
        if (searchQuery) {
            filters.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { username: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        const [users, total] = await Promise.all([
            User.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments(filters)
        ]);

        return res.status(200).json({
            message: 'User list fetched successfully',
            userdata: users,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong when fetching users!',
            error: error.message,
        });
    }
};



// Fetch the user profile on edit profile page 
export const fetchUserProfileEdit = async (req, res) => {
    try {

        const currentUserId = getCurrentUserId(req);
        const user = await User.findById(currentUserId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json({ message: 'User profile fetch successfully', user })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch user profile ' })
    }
}


// Fetch user details by id in user list page
export const getUserProfileById = async (req, res) => {
    try {

        const currentUserId = getCurrentUserId(req);
        const currentUserRole = getCurrentUserRole(req);
        const userId = req.params.id;

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (currentUserRole !== ROLE_ADMIN) {
            if (user._id = currentUserId) {
                return res.status(200).json({ message: 'User fetch successfully' });
            } else {
                return res.status(400).json({ message: 'Can not fetch other user profile ' })
            }
        }

        return res.status(200).json({ message: 'User profile fetch successfully', user })

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch user profile' })

    }
}


// Update users profile by id in user list page
export const updateUserProfileById = async (req, res) => {
    try {

        // Verify token and extract user ID
        const currentUserId = getCurrentUserId(req);
        const currentUserRole = getCurrentUserRole(req);
        const userId = req.params.id;



        if (currentUserRole !== ROLE_ADMIN && currentUserId !== userId) {
            return res.status(401).json({ message: 'Access denied. You can only update your own profile.' });
        }

        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.status(403).json({ message: 'User not found' })
        }

        // Update user with data from req.body
        Object.assign(user, req.body);
        const updatedUser = await user.save();


        return res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong when updating!', error: error.message });
    }
};

// Update user profile on edit page 
export const updateUserProfileEdit = async (req, res) => {
    try {
        const currentUserId = getCurrentUserId(req);

        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract values from req.body, use existing value if field is empty
        const {
            name = user.name,
            username = user.username,
            email = user.email
        } = req.body;

        // Clean empty strings so they don't overwrite
        const updatedData = {
            name: name.trim() === '' ? user.name : name,
            username: username.trim() === '' ? user.username : username,
            email: email.trim() === '' ? user.email : email,
        };

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            currentUserId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update user profile' });
    }
};


// Change password of the user
export const changePassword = async (req, res) => {

    try {
        const currentUserId = getCurrentUserId(req);
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required ' })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'The new password and the confirmation password must be the same' })
        }

        if (newPassword.length < 6 || newPassword.length > 20) {
            return res.status(400).json({ message: 'Password must be between 6 and 20 characters' })
        }

        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password change successfully' })

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong when change password' })
    }
}

// Delete the users
export const deleteProfile = async (req, res) => {
    // try {
    //     const user = await User.findOneAndDelete(req.params.id);
    //     if (!user) {
    //         return res.status(400).json({ message: 'User not exists !' });
    //     }
    //     return res.status(200).json({ message: 'User delete successfully !' });
    // } catch (error) {
    //     return res.status(500).json({ message: 'Smoething wrong when delete !' });
    // }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }

        // Verify token and extract user ID
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userIdFromToken = decodedToken.id;
        if (!decodedToken || !decodedToken.id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token !' });
        }

        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(userIdFromToken);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Return the user's profile information
        return res.status(200).json({ message: 'Profile delete successfully', deletedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Smoething wrong when delete !' });
    }
};


// Delete the users profile from database by admin
export const deleteUserProfile = async (req, res) => {
    try {

        const currentUserId = getCurrentUserId(req);
        const currentUserRole = getCurrentUserRole(req);

        // Only admin can delete users
        if (currentUserRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        // Find out the id of the deleted user from params
        const targetUserId = req.params.id;

        // Admin can not delete their own profile
        if (currentUserId == targetUserId) {
            return res.status(403).json({ message: 'Admin can not delete their own profile' });
        }

        // Find the target user details and delete
        const deletedUser = await User.findByIdAndDelete(targetUserId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong during deletion' });
    }
};

// Fetch the total no of users 
export const getTotalUsersNo = async (req, res) => {
    try {

        const currentUserRole = getCurrentUserRole(req);
        if (currentUserRole !== ROLE_ADMIN) {
            return res.status(403).json({ message: 'Access denied: Admin only' })
        }

        const totalUsers = await User.countDocuments()
        return res.status(200).json({ totalUsers })
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong when fetch no of users' })
    }
}


// Fetch get all users id and username
export const getUserIdandName = async (req, res) => {
    try {

        const currentUserRole = getCurrentUserRole(req);
        const currentUserId = getCurrentUserId(req);

        if (currentUserRole !== ROLE_ADMIN) {
            const user = await User.findById(currentUserId, { _id: 1, name: 1 });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User', users: [user] });
        };

        const users = await User.find({}, { _id: 1, name: 1 });
        return res.status(200).json({ message: 'Users', users })

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch the user id and name ' })
    }
};