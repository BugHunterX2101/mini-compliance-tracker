# Mini Compliance Tracker — Full Stack Build

## Planning
- [x] Read all documentation (PRD, Tech Architecture, DESIGN.md, 3D design doc)
- [/] Write implementation plan
- [ ] Get user approval

## Backend (apps/api)
- [ ] Initialize Node.js/Express project with TypeScript
- [ ] Create shared Zod schemas (client + task)
- [ ] Create SQLite database layer with better-sqlite3
- [ ] Create database schema and seed script
- [ ] Create Express routes: GET /api/clients, GET /api/clients/:id/tasks, POST /api/tasks, PATCH /api/tasks/:id/status
- [ ] Create validation middleware + error handling
- [ ] Create API entry point (index.ts)

## Frontend (apps/web)
- [ ] Initialize React + Vite project with TypeScript
- [ ] Implement design system (CSS variables, Inter font, glassmorphism, no-line rule)
- [ ] Build base UI components (Button, Badge, Card, Modal, Input, Select)
- [ ] Build layout components (AppShell, Sidebar)
- [ ] Build feature components (ClientCard, TaskRow, TaskModal, FilterBar)
- [ ] Build pages (Dashboard/ClientView)
- [ ] Implement React hooks (useClients, useTasks, useFilters)
- [ ] Wire API calls to backend

## Verification
- [ ] Verify project structure matches architecture doc
- [ ] Verify TypeScript compiles without errors
- [ ] Create walkthrough document
