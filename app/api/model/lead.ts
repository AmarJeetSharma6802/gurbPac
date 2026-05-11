import mongoose, { Schema } from "mongoose";

const leadSchema = new Schema({
  studentName: String,

  email: String,

  phone: String,

  language: String,

  courseName: String,

  teacherName: String,

  rating: String,

  didntLike: String,

  // Tracking Fields
  gclid: String,

  utm_source: String,

  utm_medium: String,

  utm_campaign: String,

  utm_term: String,

  platform: String,

  referrer: String,

  createdAt: {
    type: Date,

    default: Date.now,
  },
});

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);
