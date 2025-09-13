import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, enum: ["open", "in-progress", "closed"], default: "open" },
  labels: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  repoId: { type: mongoose.Schema.Types.ObjectId, ref: "Repository", required: true },
}, { timestamps: true });

export default mongoose.model("Issue", issueSchema);
