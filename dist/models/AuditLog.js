import mongoose, { Schema } from 'mongoose';
const auditLogSchema = new Schema({
    action: { type: String, required: true },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    targetId: { type: String },
    targetModel: { type: String },
    details: { type: Schema.Types.Mixed },
}, {
    timestamps: { createdAt: 'timestamp', updatedAt: false },
});
export default mongoose.model('AuditLog', auditLogSchema);
