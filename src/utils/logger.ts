import type { Types } from 'mongoose';
import AuditLog from '../models/AuditLog.js';

export const logAction = async (
  action: string, userId: string | Types.ObjectId, details: any = {},
  targetId?: string, targetModel?: string
) => {
  try {
    await AuditLog.create({ action, performedBy: userId, details, targetId, targetModel });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};
