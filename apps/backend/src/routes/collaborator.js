import express from "express";
import Repository from "../models/Repository.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

// Add collaborator (owner only)
router.post("/", verifyToken, async (req, res) => {
  try {
    const repoId = req.params.repoId;
    const { collaboratorUid } = req.body;

    const repo = await Repository.findById(repoId);
    if (!repo) return res.status(404).json({ error: "Repository not found" });

    // Only owner can add collaborators
    if (!repo.owner.equals(req.user._id)) {
      return res.status(403).json({ error: "Only owner can add collaborators" });
    }

    const collaborator = await User.findOne({ uid: collaboratorUid });
    if (!collaborator) return res.status(404).json({ error: "User not found" });

    if (repo.collaborators.includes(collaborator._id)) {
      return res.status(400).json({ error: "User is already a collaborator" });
    }

    repo.collaborators.push(collaborator._id);
    await repo.save();

    res.json({ message: "Collaborator added", repo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
