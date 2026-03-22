# LedgersCFO — Mini Compliance Tracker

A full-stack web application for managing compliance tasks across multiple clients. Built with a premium **"Architectural Ledger"** design system featuring glassmorphism, tonal planes, and 3D depth.

## Architecture

```
ledgers-compliance-tracker/
├── apps/
│   ├── api/          # Express + SQLite backend
│   └── web/          # React + Vite frontend
├── packages/
│   └── shared/       # Shared Zod schemas & types
└── package.json      # npm workspaces root
```

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, TanStack Query      |
| Backend    | Node.js, Express, better-sqlite3    |
| Validation | Zod (shared schemas)                |
| Database   | SQLite                              |
| Styling    | Vanilla CSS (Architectural Ledger)  |

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation
```bash
npm install
```

### Seed the Database
```bash
npm run seed
```
This creates 5 sample clients and ~30 compliance tasks with a mix of statuses and due dates.

### Run Development Servers

**Backend API** (port 3001):
```bash
npm run dev:api
```

**Frontend** (port 3000):
```bash
npm run dev:web
```

The Vite dev server proxies `/api` requests to `localhost:3001`.

### Environment Variables

**Backend** (`apps/api/.env`):
```
DATABASE_URL=./data/compliance.db
PORT=3001
```

**Frontend** (`apps/web/.env`):
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## API Endpoints

| Method | Endpoint                    | Description            |
|--------|-----------------------------|------------------------|
| GET    | `/api/clients`              | List all clients       |
| GET    | `/api/clients/:id/tasks`    | Get tasks for a client |
| POST   | `/api/tasks`                | Create a new task      |
| PATCH  | `/api/tasks/:id/status`     | Update task status     |
| GET    | `/api/health`               | Health check           |

## Features

- **Client Portfolio Sidebar** — searchable client list with selection state
- **Task Table** — sortable by due date with inline status updates
- **Overdue Highlighting** — tasks past due date shown in red with warning icon
- **Combinable Filters** — filter by status AND category simultaneously
- **Add Task Modal** — glassmorphic form with validation
- **Optimistic Updates** — status changes reflect instantly, sync in background
- **Responsive Design** — adapts from desktop to mobile

## Design System

Based on the "Architectural Ledger" creative north star:
- **No-Line Rule** — no 1px borders; surfaces separated by tonal planes
- **Glassmorphism** — frosted glass modals with backdrop blur
- **Ambient Shadows** — tinted multi-layer shadows instead of drop shadows
- **Entrance Animations** — staggered slide-up on task rows
- **Inter Typography** — editorial scale (Display → Label)

## Tradeoffs

- SQLite chosen for simplicity — not suitable for horizontal scaling
- No authentication — acceptable for assignment scope
- Frontend state is local (no Redux) — appropriate for app size
- PATCH endpoint updates status only — full PUT deferred to v2
