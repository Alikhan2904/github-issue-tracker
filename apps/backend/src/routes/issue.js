import express from "express";
import Issue from "../models/Issue.js";
import { verifyToken } from "../middleware/auth.js";
import { requireCollaborator } from "../middleware/collaborator.js";

const router = express.Router({ mergeParams: true });

// Create issue (collaborators only)
router.post("/", verifyToken, requireCollaborator, async (req, res) => {
  try {
    const { title, description, labels, assignedTo } = req.body;
    const issue = await Issue.create({
      title,
      description,
      labels,
      assignedTo,
      repoId: req.params.repoId,
      createdBy: req.user._id,
    });
    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List issues with optional filters
router.get("/", verifyToken, requireCollaborator, async (req, res) => {
  try {
    const filters = { repoId: req.params.repoId };
    if (req.query.status) filters.status = req.query.status;
    if (req.query.labels) filters.labels = { $in: req.query.labels.split(",") };

    const issues = await Issue.find(filters)
      .populate("createdBy", "email displayName")
      .populate("assignedTo", "email displayName");
    res.json(issues);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update issue status
router.patch("/:issueId", verifyToken, requireCollaborator, async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    if (status) issue.status = status;
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
