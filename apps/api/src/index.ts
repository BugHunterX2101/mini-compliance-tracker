import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clients";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────
app.use("/api/clients", clientRoutes);
app.use("/api/tasks", taskRoutes);

// ─── Health Check ───────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error Handler ──────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[API] LedgersCFO Compliance Tracker listening on http://localhost:${PORT}`);
});

export default app;
