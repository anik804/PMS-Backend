import express from 'express';
import { createProject, deleteProject, getProjects, updateProject } from '../controllers/projectController.ts';
import { authorize, protect } from '../middlewares/auth.ts';
import { UserRole } from '../models/User.ts';

const router = express.Router();
router.route('/').post(protect, createProject).get(protect, getProjects);
router.route('/:id').patch(protect, authorize(UserRole.ADMIN), updateProject).delete(protect, authorize(UserRole.ADMIN), deleteProject);

export default router;
