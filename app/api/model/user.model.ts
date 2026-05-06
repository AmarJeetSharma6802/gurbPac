import mongoose, { Schema, Model, Document } from "mongoose";

interface Teacher extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken: string;
  role: string;
  isVerified: boolean;
emailOtp: string | null;
  emailOtpExpires: Date | null;
}

const teacherSchema: Schema<Teacher> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["principal", "teacher"],
      default: "teacher",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: {
      type: String,
      default: null,
    },

    emailOtpExpires: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const teacher: Model<Teacher> =
  mongoose.models.teacher || mongoose.model<Teacher>("teacher", teacherSchema);

export default teacher;
