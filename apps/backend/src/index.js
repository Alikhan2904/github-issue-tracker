import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

connectDB();

app.get("/", (req, res) => res.send("Backend running"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));
