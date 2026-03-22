import { useState, useMemo } from "react";
import type { Client, Task, Category, Status } from "@ledgers/shared";
import { isTaskOverdue, CATEGORIES, STATUSES } from "@ledgers/shared";
import { useClients } from "./hooks/useClients";
import { useTasks } from "./hooks/useTasks";
import { useFilters } from "./hooks/useFilters";

export default function App() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: clients, isLoading: clientsLoading } = useClients();
  const { tasksQuery, addTaskMutation, updateStatusMutation } = useTasks(selectedClientId);
  const { filters, setStatus, setCategory, statusOptions, categoryOptions } =
    useFilters(selectedClientId);

  const selectedClient = clients?.find((c) => c.id === selectedClientId);

  // Filter clients by search
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (c) =>
        c.company_name.toLowerCase().includes(q) ||
        c.entity_type.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (!tasksQuery.data) return [];
    return tasksQuery.data.filter((task) => {
      if (filters.status !== "All" && task.status !== filters.status) return false;
      if (filters.category !== "All" && task.category !== filters.category) return false;
      return true;
    });
  }, [tasksQuery.data, filters]);

  // Stats
  const stats = useMemo(() => {
    const tasks = tasksQuery.data || [];
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "Pending").length,
      overdue: tasks.filter((t) => isTaskOverdue(t)).length,
    };
  }, [tasksQuery.data]);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateStatusMutation.mutate({ taskId, status: newStatus });
  };

  const handleAddTask = (formData: {
    title: string;
    category: string;
    due_date: string;
    priority: string;
    description: string;
  }) => {
    if (!selectedClientId) return;
    addTaskMutation.mutate(
      {
        client_id: selectedClientId,
        title: formData.title,
        category: formData.category as Category,
        due_date: formData.due_date,
        priority: formData.priority as "Low" | "Medium" | "High",
        description: formData.description,
      },
      {
        onSuccess: () => setShowAddModal(false),
      }
    );
  };

  return (
    <div className="app-shell">
      {/* ─── Sidebar ─── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">L</div>
            <div>
              <div className="sidebar-logo-text">LedgersCFO</div>
              <div className="sidebar-logo-sub">Compliance Tracker</div>
            </div>
          </div>
          <input
            type="text"
            className="sidebar-search"
            placeholder="Search clients…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="sidebar-label">Client Portfolio</div>
        <div className="sidebar-clients">
          {clientsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton skeleton-card" />
              ))
            : filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={`client-card ${selectedClientId === client.id ? "active" : ""}`}
                  onClick={() => setSelectedClientId(client.id)}
                >
                  <div className="client-card-name">{client.company_name}</div>
                  <div className="client-card-meta">
                    <span>{client.entity_type}</span>
                    <span className="client-card-dot" />
                    <span>{client.country}</span>
                  </div>
                </div>
              ))}
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="main-content">
        {!selectedClientId ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">Select a Client</div>
            <div className="empty-text">
              Choose a client from the sidebar to view and manage their compliance tasks.
            </div>
          </div>
        ) : (
          <>
            {/* Page Header */}
            <div className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title">{selectedClient?.company_name}</h1>
                  <p className="page-subtitle">
                    {selectedClient?.entity_type} · {selectedClient?.country}
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  <span>＋</span> Add Task
                </button>
              </div>
            </div>

            {/* Stats Strip */}
            <div className="stats-strip">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card">
                <div className={`stat-value ${stats.overdue > 0 ? "overdue" : ""}`}>
                  {stats.overdue}
                </div>
                <div className="stat-label">Overdue</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
              <span className="filter-label">Filter by</span>
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => setStatus(e.target.value as Status | "All")}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Status" : s}
                  </option>
                ))}
              </select>
              <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => setCategory(e.target.value as Category | "All")}
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Table */}
            <div className="task-table">
              <div className="task-table-header">
                <span>Task</span>
                <span>Category</span>
                <span>Due Date</span>
                <span>Status</span>
                <span>Priority</span>
              </div>

              {tasksQuery.isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton skeleton-row" />
                ))
              ) : filteredTasks.length === 0 ? (
                <div className="empty-state" style={{ padding: "3rem" }}>
                  <div className="empty-icon">🔍</div>
                  <div className="empty-title">No tasks found</div>
                  <div className="empty-text">
                    {tasksQuery.data?.length === 0
                      ? "This client has no compliance tasks yet."
                      : "Try adjusting your filters."}
                  </div>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const overdue = isTaskOverdue(task);
                  return (
                    <div
                      key={task.id}
                      className={`task-row ${overdue ? "overdue" : ""}`}
                    >
                      {/* Title */}
                      <div className="task-title-wrapper">
                        {overdue && <span className="overdue-icon">⚠</span>}
                        <span className="task-title">{task.title}</span>
                      </div>

                      {/* Category */}
                      <div className="task-category">{task.category}</div>

                      {/* Due Date */}
                      <div className={`task-due-date ${overdue ? "overdue" : ""}`}>
                        {formatDate(task.due_date)}
                      </div>

                      {/* Status (inline select) */}
                      <div>
                        <select
                          className={`status-select ${getStatusClass(task.status, overdue)}`}
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      {/* Priority */}
                      <div className={`priority priority-${task.priority.toLowerCase()}`}>
                        <span className="priority-dot" />
                        {task.priority}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>

      {/* ─── Add Task Modal ─── */}
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTask}
          isLoading={addTaskMutation.isPending}
        />
      )}
    </div>
  );
}

// ─── Add Task Modal Component ───────────────────────────────────
function AddTaskModal({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: string;
    due_date: string;
    priority: string;
    description: string;
  }) => void;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<string>("Medium");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!dueDate) errs.due_date = "Due date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title, category, due_date: dueDate, priority, description });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Add Compliance Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              className="form-input"
              type="text"
              placeholder="e.g. GSTR-3B Filing — March 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="task-category">Category *</label>
              <select
                id="task-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">Priority *</label>
              <select
                id="task-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-due-date">Due Date *</label>
            <input
              id="task-due-date"
              className="form-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            {errors.due_date && <div className="form-error">{errors.due_date}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              className="form-textarea"
              placeholder="Optional — add any relevant notes…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Creating…" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status: string, overdue: boolean): string {
  if (overdue && status !== "Completed") return "overdue";
  switch (status) {
    case "Completed":
      return "completed";
    case "In Progress":
      return "in-progress";
    default:
      return "pending";
  }
}
