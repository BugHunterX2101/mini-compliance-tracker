import { z } from "zod";

// ─── Category & Status Enums ────────────────────────────────────
export const CATEGORIES = [
  "GST",
  "TDS",
  "Income Tax",
  "ROC Compliance",
  "Other",
] as const;

export const STATUSES = ["Pending", "In Progress", "Completed"] as const;

export const PRIORITIES = ["Low", "Medium", "High"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

// ─── Client Schema ──────────────────────────────────────────────
export const clientSchema = z.object({
  id: z.string().uuid(),
  company_name: z.string().min(1),
  entity_type: z.string().min(1),
  country: z.string().min(1),
  created_at: z.string(),
});

export type Client = z.infer<typeof clientSchema>;

// ─── Task Schema ────────────────────────────────────────────────
export const taskSchema = z.object({
  id: z.string().uuid(),
  client_id: z.string().uuid(),
  title: z.string().min(1),
  category: z.enum(CATEGORIES),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  status: z.enum(STATUSES),
  priority: z.enum(PRIORITIES),
  description: z.string().optional().default(""),
  created_at: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

// ─── Create Task (request body) ─────────────────────────────────
export const createTaskSchema = z.object({
  client_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be YYYY-MM-DD"),
  priority: z.enum(PRIORITIES, {
    errorMap: () => ({ message: "Invalid priority" }),
  }),
  description: z.string().optional().default(""),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

// ─── Update Task Status (request body) ──────────────────────────
export const updateTaskStatusSchema = z.object({
  status: z.enum(STATUSES, {
    errorMap: () => ({
      message: "Status must be Pending, In Progress, or Completed",
    }),
  }),
});

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

// ─── Helpers ────────────────────────────────────────────────────
export function isTaskOverdue(task: { due_date: string; status: string }): boolean {
  if (task.status === "Completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.due_date + "T00:00:00");
  return dueDate < today;
}
