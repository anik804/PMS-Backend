import mongoose, { Document, Schema } from 'mongoose';

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export interface IProject extends Document {
  name: string;
  description: string;
  status: ProjectStatus;
  isDeleted: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// Middleware to filter out deleted projects by default
projectSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

projectSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

export default mongoose.model<IProject>('Project', projectSchema);
