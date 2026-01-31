import mongoose, { Schema } from 'mongoose';
export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ACTIVE"] = "ACTIVE";
    ProjectStatus["ARCHIVED"] = "ARCHIVED";
    ProjectStatus["DELETED"] = "DELETED";
})(ProjectStatus || (ProjectStatus = {}));
const projectSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(ProjectStatus),
        default: ProjectStatus.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
// Middleware to filter out deleted projects by default
projectSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
projectSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});
export default mongoose.model('Project', projectSchema);
