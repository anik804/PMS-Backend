import AuditLog from '../models/AuditLog';
export const logAction = async (action, userId, details = {}, targetId, targetModel) => {
    try {
        await AuditLog.create({ action, performedBy: userId, details, targetId, targetModel });
    }
    catch (error) {
        console.error('Audit Log Error:', error);
    }
};
