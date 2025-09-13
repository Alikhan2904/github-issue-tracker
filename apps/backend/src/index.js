import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import repoRoutes from "./routes/repo.js";
import issueRoutes from "./routes/issue.js";
import collaboratorRoutes from "./routes/collaborator.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/repos", repoRoutes);
app.use("/api/repos/:repoId/issues", issueRoutes);
app.use("/api/repos/:repoId/collaborators", collaboratorRoutes);

connectDB();

app.get("/", (req, res) => res.send("Backend running"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));
