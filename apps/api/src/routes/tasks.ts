import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../lib/db";
import { validate } from "../middleware/validate";
import { createTaskSchema, updateTaskStatusSchema } from "@ledgers/shared";

const router = Router();

// POST /api/tasks — Create a new task
router.post("/", validate(createTaskSchema), (req: Request, res: Response) => {
  try {
    const { client_id, title, category, due_date, priority, description } = req.body;

    // Verify client exists
    const client = db.prepare("SELECT id FROM clients WHERE id = ?").get(client_id);
    if (!client) {
      res.status(404).json({ error: "Client not found", details: `No client with id ${client_id}` });
      return;
    }

    const id = uuidv4();
    const created_at = new Date().toISOString();

    db.prepare(
      `INSERT INTO tasks (id, client_id, title, category, due_date, status, priority, description, created_at) 
       VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?, ?)`
    ).run(id, client_id, title, category, due_date, priority, description || "", created_at);

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PATCH /api/tasks/:id/status — Update task status
router.patch("/:id/status", validate(updateTaskStatusSchema), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = db.prepare("SELECT id FROM tasks WHERE id = ?").get(id);
    if (!existing) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    db.prepare("UPDATE tasks SET status = ? WHERE id = ?").run(status, id);

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task status" });
  }
});

export default router;
