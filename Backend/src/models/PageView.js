import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, trim: true },
    visitorId: { type: String, required: true, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true }
);

pageViewSchema.index({ path: 1, visitorId: 1, createdAt: -1 });
pageViewSchema.index({ path: 1, createdAt: -1 });

export default mongoose.model("PageView", pageViewSchema);
