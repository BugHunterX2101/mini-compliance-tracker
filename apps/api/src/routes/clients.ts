import { Router, Request, Response } from "express";
import db from "../lib/db";

const router = Router();

// GET /api/clients — List all clients
router.get("/", (_req: Request, res: Response) => {
  try {
    const clients = db.prepare("SELECT * FROM clients ORDER BY company_name ASC").all();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// GET /api/clients/:id/tasks — Get tasks for a specific client
router.get("/:id/tasks", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verify client exists
    const client = db.prepare("SELECT id FROM clients WHERE id = ?").get(id);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    const tasks = db
      .prepare("SELECT * FROM tasks WHERE client_id = ? ORDER BY due_date ASC")
      .all(id);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

export default router;
