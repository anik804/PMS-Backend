import User from '../models/User';
import { logAction } from '../utils/logger';
export const getUsers = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keywordValue = req.query.keyword;
    const keyword = keywordValue
        ? {
            $or: [
                { name: { $regex: keywordValue, $options: 'i' } },
                { email: { $regex: keywordValue, $options: 'i' } },
            ],
        }
        : {};
    try {
        const count = await User.countDocuments({ ...keyword });
        const users = await User.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });
        res.json({ users, page, pages: Math.ceil(count / pageSize) });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateUserRole = async (req, res) => {
    const { role } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const oldRole = user.role;
            user.role = role || user.role;
            const updatedUser = await user.save();
            await logAction('USER_ROLE_UPDATED', req.user._id, { targetUserId: user._id, oldRole, newRole: updatedUser.role }, user._id.toString(), 'User');
            res.json(updatedUser);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateUserStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const oldStatus = user.status;
            user.status = status || user.status;
            const updatedUser = await user.save();
            await logAction('USER_STATUS_UPDATED', req.user._id, { targetUserId: user._id, oldStatus, newStatus: updatedUser.status }, user._id.toString(), 'User');
            res.json(updatedUser);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user)
        res.json(user);
    else
        res.status(404).json({ message: 'User not found' });
};
export const updateUserProfile = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            if (password) {
                user.password = password;
                // Pre-save hook will hash this. But need to handle logic carefully.
                // User model hashes if modified. Correct.
            }
            const updatedUser = await user.save();
            // Update response with just the fields we want to send back, including new token if desired (optional)
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status,
            });
            await logAction('USER_PROFILE_UPDATED', user._id.toString(), { name: user.name, email: user.email }, user._id.toString(), 'User');
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
