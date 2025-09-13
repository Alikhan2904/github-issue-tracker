import Repository from "../models/Repository.js";

export const requireCollaborator = async (req, res, next) => {
  const repoId = req.params.repoId;
  const repo = await Repository.findById(repoId);
  if (!repo) return res.status(404).json({ error: "Repository not found" });

  const isCollaborator = repo.collaborators.includes(req.user._id) || repo.owner.equals(req.user._id);
  if (!isCollaborator) return res.status(403).json({ error: "Not a collaborator" });

  req.repo = repo;
  next();
};
