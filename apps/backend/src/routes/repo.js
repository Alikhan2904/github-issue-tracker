import express from "express";
import Repository from "../models/Repository.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// Create a new repo (only owner)
router.post("/", verifyToken, requireRole("owner"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const repo = await Repository.create({
      name,
      description,
      owner: req.user._id,
      collaborators: [],
    });
    res.status(201).json(repo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List repos accessible to the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const repos = await Repository.find({
      $or: [
        { owner: req.user._id },
        { collaborators: req.user._id }
      ]
    }).populate("owner", "email displayName").populate("collaborators", "email displayName");
    res.json(repos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
