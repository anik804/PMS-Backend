import Project, { ProjectStatus } from '../models/Project';
import { logAction } from '../utils/logger';
export const createProject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const project = await Project.create({
            name, description, createdBy: req.user._id, status: ProjectStatus.ACTIVE,
        });
        await logAction('PROJECT_CREATED', req.user._id, { name: project.name }, project._id.toString(), 'Project');
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getProjects = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keywordValue = req.query.keyword;
    const keyword = keywordValue ? { name: { $regex: keywordValue, $options: 'i' } } : {};
    try {
        const count = await Project.countDocuments({ ...keyword });
        const projects = await Project.find({ ...keyword })
            .populate('createdBy', 'name email')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });
        res.json({ projects, page, pages: Math.ceil(count / pageSize) });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateProject = async (req, res) => {
    const { name, description, status } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            project.name = name || project.name;
            project.description = description || project.description;
            project.status = status || project.status;
            const updatedProject = await project.save();
            await logAction('PROJECT_UPDATED', req.user._id, { name: updatedProject.name }, project._id.toString(), 'Project');
            res.json(updatedProject);
        }
        else
            res.status(404).json({ message: 'Project not found' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            project.isDeleted = true;
            project.status = ProjectStatus.DELETED;
            await project.save();
            await logAction('PROJECT_SOFT_DELETED', req.user._id, { name: project.name }, project._id.toString(), 'Project');
            res.json({ message: 'Project removed (soft delete)' });
        }
        else
            res.status(404).json({ message: 'Project not found' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
