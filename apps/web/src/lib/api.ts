import axios from "axios";
import type { Client, Task, CreateTaskInput, UpdateTaskStatusInput } from "@ledgers/shared";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Client Endpoints ───────────────────────────────────────────
export async function fetchClients(): Promise<Client[]> {
  const { data } = await api.get<Client[]>("/clients");
  return data;
}

export async function fetchClientTasks(clientId: string): Promise<Task[]> {
  const { data } = await api.get<Task[]>(`/clients/${clientId}/tasks`);
  return data;
}

// ─── Task Endpoints ─────────────────────────────────────────────
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data } = await api.post<Task>("/tasks", input);
  return data;
}

export async function updateTaskStatus(
  taskId: string,
  input: UpdateTaskStatusInput
): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${taskId}/status`, input);
  return data;
}
