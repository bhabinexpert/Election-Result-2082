// ----- Election Result Model -----
// Stores individual candidate results from the election

import mongoose from "mongoose";

const electionResultSchema = new mongoose.Schema(
  {
    candidate_id: { type: Number, required: true, unique: true },
    candidate_name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
      lowercase: true,
    },
    party: { type: String, required: true, trim: true },
    votes: { type: Number, required: true, default: 0 },
    constituency: { type: String, required: true, trim: true },
    district_id: { type: Number, required: true },
    // Denormalized fields — avoids joins for faster reads
    district_name: { type: String, trim: true },
    province_id: { type: Number },
    province_name: { type: String, trim: true },
  },
  { timestamps: true }
);

// Indexes for frequently filtered/sorted fields
electionResultSchema.index({ district_id: 1 });
electionResultSchema.index({ province_id: 1 });
electionResultSchema.index({ party: 1 });
electionResultSchema.index({ constituency: 1 });
electionResultSchema.index({ votes: -1 });

export default mongoose.model("ElectionResult", electionResultSchema);
