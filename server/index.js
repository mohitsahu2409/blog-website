import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import { pool } from "./db/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);

// Routes
app.use("/api/auth", authRoutes);

// 🔍 Add logging middleware for posts
app.use("/api/posts", (req, res, next) => {
  console.log("➡️ Incoming request:", req.method, req.originalUrl);
  next();
}, postRoutes);


// Test DB connection
pool.connect()
  .then(() => console.log("✅ PostgreSQL connected successfully"))
  .catch((err) => console.error("❌ DB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
