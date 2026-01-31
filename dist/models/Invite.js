import mongoose, { Schema } from 'mongoose';
import { UserRole } from './User';
const inviteSchema = new Schema({
    email: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
}, { timestamps: true });
export default mongoose.model('Invite', inviteSchema);
