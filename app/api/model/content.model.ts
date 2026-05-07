import mongoose, { Schema, Document, Model } from "mongoose";

export type ContentStatus = "pending" | "approved" | "rejected";

export interface IContent extends Document {
  teacherId: mongoose.Types.ObjectId;

  title: string;
  subject: string;
  description?: string;

  videoUrl: string;
  posterUrl: string;
  // publicId: string;
  slug: string;

  status: ContentStatus;
  rejectionReason?: string;
  rejectedBy?: mongoose.Types.ObjectId;
  rotationDuration?: number;

  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    videoUrl: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
    },

    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: "teacher",
    },

    rotationDuration: {
      type: Number,
      default: 10,
    },

  slug: {
  type: String,
  required: true,
  unique: true,
},
  },
  {
    timestamps: true,
  },
);

ContentSchema.index({ status: 1 });
ContentSchema.index({ teacherId: 1 });

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>("Content", ContentSchema);

  export default Content