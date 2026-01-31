import type { Request, Response } from 'express';
import Project, { ProjectStatus } from '../models/Project.js';
import User from '../models/User.js';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalProjects = await Project.countDocuments({ isDeleted: false });
    const activeProjects = await Project.countDocuments({ status: ProjectStatus.ACTIVE, isDeleted: false });
    const totalUsers = await User.countDocuments();

    res.json({
      totalProjects,
      activeProjects,
      totalUsers,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
