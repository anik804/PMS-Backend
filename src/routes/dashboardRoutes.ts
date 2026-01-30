import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.ts';
import { protect } from '../middlewares/auth.ts';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);

export default router;
