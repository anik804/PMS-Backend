import crypto from 'crypto';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Invite from '../models/Invite.ts';
import User, { UserRole, UserStatus } from '../models/User.ts';
import { logAction } from '../utils/logger.ts';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d',
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password }); // DEBUG LOG

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'YES' : 'NO'); // DEBUG LOG

    if (user) {
      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch); // DEBUG LOG

      if (isMatch) {
        if (user.status === UserStatus.INACTIVE) {
          return res.status(403).json({ message: 'Account is deactivated.' });
        }
        await logAction('USER_LOGIN', user._id.toString(), { email: user.email });
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          token: generateToken(user._id.toString()),
        });
        return;
      }
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const inviteUser = async (req: any, res: Response) => {
  const { email, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const inviteExists = await Invite.findOne({ email, acceptedAt: { $exists: false } });
    if (inviteExists) {
      inviteExists.token = crypto.randomBytes(20).toString('hex');
      inviteExists.role = role || UserRole.STAFF;
      inviteExists.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await inviteExists.save();
      await logAction('INVITE_RESENT', req.user._id, { email, role: inviteExists.role });
      return res.status(200).json({
        message: 'Invite resent',
        token: inviteExists.token,
        inviteUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register?token=${inviteExists.token}`
      });
    }
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const invite = await Invite.create({ email, role: role || UserRole.STAFF, token, expiresAt });
    await logAction('INVITE_CREATED', req.user._id, { email, role: invite.role });
    res.status(201).json({
      message: 'Invite generated successfully',
      token: invite.token,
      inviteUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register?token=${invite.token}`
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const registerViaInvite = async (req: Request, res: Response) => {
  const { token, name, password } = req.body;
  try {
    const invite = await Invite.findOne({ token });
    if (!invite || invite.acceptedAt || new Date() > invite.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired invite token' });
    }
    const user = await User.create({
      name, email: invite.email, password, role: invite.role,
      status: UserStatus.ACTIVE, invitedAt: invite.createdAt,
    });
    invite.acceptedAt = new Date();
    await invite.save();
    await logAction('USER_REGISTERED_VIA_INVITE', user._id.toString(), { email: user.email, role: user.role });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const validateInvite = async (req: Request, res: Response) => {
  try {
    const invite = await Invite.findOne({ token: req.params.token });
    if (!invite || invite.acceptedAt || new Date() > invite.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired invite token', valid: false });
    }
    res.json({ valid: true, email: invite.email, role: invite.role });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
