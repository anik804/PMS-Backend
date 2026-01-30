import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  performedBy: mongoose.Types.ObjectId;
  targetId?: string;
  targetModel?: string;
  details: Schema.Types.Mixed;
  timestamp: Date;
}

const auditLogSchema: Schema = new Schema(
  {
    action: { type: String, required: true },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetId: { type: String },
    targetModel: { type: String },
    details: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false },
  }
);

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
