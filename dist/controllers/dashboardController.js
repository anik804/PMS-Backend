import Project, { ProjectStatus } from '../models/Project';
import User from '../models/User';
export const getDashboardStats = async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments({ isDeleted: false });
        const activeProjects = await Project.countDocuments({ status: ProjectStatus.ACTIVE, isDeleted: false });
        const totalUsers = await User.countDocuments();
        res.json({
            totalProjects,
            activeProjects,
            totalUsers,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
