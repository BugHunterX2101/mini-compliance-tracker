import express from "express";
import cors from "cors";
import path from "path";
import clientRoutes from "./routes/clients";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── API Routes ─────────────────────────────────────────────────
app.use("/api/clients", clientRoutes);
app.use("/api/tasks", taskRoutes);

// ─── Health Check ───────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Serve Frontend (Production) ────────────────────────────────
const frontendPath = path.join(__dirname, "../../web/dist");
app.use(express.static(frontendPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ─── Error Handler ──────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[API] LedgersCFO Compliance Tracker listening on http://localhost:${PORT}`);
});

export default app;
