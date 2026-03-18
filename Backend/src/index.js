// ----- Main Server Entry Point -----
// Configures and starts the Express server

import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import electionRoutes from "./routes/electionRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ----- Middleware -----
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ----- API Routes -----
app.use("/api/elections", electionRoutes);

// ----- Health Check -----
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Nepal Election 2082 API is running" });
});

// ----- Start Server -----
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\nServer running on http://localhost:${PORT}`);
    console.log(`API base URL: http://localhost:${PORT}/api/elections\n`);
  });
};

startServer();
