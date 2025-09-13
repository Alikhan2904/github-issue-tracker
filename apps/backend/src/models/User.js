import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String },
  displayName: { type: String },
  role: { type: String, enum: ["owner", "collaborator", "viewer"], default: "viewer" },
});

export default mongoose.model("User", userSchema);
