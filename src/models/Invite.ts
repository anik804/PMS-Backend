import mongoose, { Schema, type Document } from 'mongoose';
import { UserRole } from './User.ts';

export interface IInvite extends Document {
  email: string;
  role: UserRole;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

const inviteSchema: Schema = new Schema({
  email: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  acceptedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<IInvite>('Invite', inviteSchema);
