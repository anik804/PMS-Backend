import express from 'express';
import { getUserProfile, getUsers, updateUserProfile, updateUserRole, updateUserStatus } from '../controllers/userController.ts';
import { authorize, protect } from '../middlewares/auth.ts';
import { UserRole } from '../models/User.ts';

const router = express.Router();
router.get('/', protect, authorize(UserRole.ADMIN), getUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.patch('/:id/role', protect, authorize(UserRole.ADMIN), updateUserRole);
router.patch('/:id/status', protect, authorize(UserRole.ADMIN), updateUserStatus);

export default router;
