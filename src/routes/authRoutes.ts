import express from 'express';
import { inviteUser, login, registerViaInvite, validateInvite } from '../controllers/authController.ts';
import { authorize, protect } from '../middlewares/auth.ts';
import { UserRole } from '../models/User.ts';

const router = express.Router();
router.post('/login', login);
router.post('/invite', protect, authorize(UserRole.ADMIN), inviteUser);
router.post('/register-via-invite', registerViaInvite);
router.get('/validate-invite/:token', validateInvite);

export default router;
