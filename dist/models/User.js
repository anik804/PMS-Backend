import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["STAFF"] = "STAFF";
})(UserRole || (UserRole = {}));
export var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
})(UserStatus || (UserStatus = {}));
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.STAFF,
    },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE,
    },
    invitedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
userSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
export default mongoose.model('User', userSchema);
