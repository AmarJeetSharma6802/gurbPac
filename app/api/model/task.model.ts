import mongoose, { Schema, Document, Model } from "mongoose";

interface TaskModel extends Document {
  teacherId: mongoose.Types.ObjectId;
  contentId: mongoose.Types.ObjectId;

  homeworkTitle: string;
  description?: string;
  dueDate: Date;
  totalMarks: number;

  status: "active" | "completed" | "expired";

  imageUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskModel>({
  teacherId: {
    type: mongoose.Types.ObjectId,
    ref: "teacher",
  },
  contentId: {
    type: mongoose.Types.ObjectId,
    ref: "Content",
  },
  homeworkTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },

  totalMarks: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["active", "completed", "expired"],
    default: "active",
  },

  imageUrl: {
  type: String,
}
});

const Task: Model<TaskModel> = mongoose.models.Task || mongoose.model<TaskModel>("Task", taskSchema);

export default Task;
