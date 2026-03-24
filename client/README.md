# Real-Time Client Project Dashboard

A comprehensive full-stack application built to seamlessly manage real-time tasks, role-based access control, and projects. It is designed around a modern stack (React/Vite for the frontend, Node.js/Express for the backend) and efficiently uses real-time WebSockets to synchronize state.

## 🚀 Local Setup Instructions

We recommend using **Docker** for local setup to ensure consistent environments.

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)

### Setup using Docker (Preferred)
1. Clone the repository.
2. In the root directory, create a `.env` file (copying from `.env.example` if available) and ensure database credentials are set.
3. Run the following command to start both client and server containers, along with the database:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:5173` and the API at `http://localhost:5000`.

### Manual Setup
1. **Server**: Go to `/server`, run `npm install`, then run `npm run prisma:generate` and `npm run prisma:migrate`. Finally, start the dev server via `npm run dev`.
2. **Client**: Go to `/client`, run `npm install`, and start the dev server via `npm run dev`.

---

## 🗄 Database Schema Description

The application relies on a relational database managed by **Prisma** (currently configured for SQLite, with PostgreSQL support available). Core entities include:

- **User**: Stores authentication details and roles (`ADMIN`, `PROJECT_MANAGER`, `DEVELOPER`). Contains a 1-to-many relationship with assigned tasks and managed projects.
- **Project**: Represents client projects, linked to a specific manager (`User`) and containing multiple tasks.
- **Task**: Tracks individual work items with specific `status`, `priority`, and `dueDate`. Linked to a developer and a project.
- **ActivityLog**: An audit trail tracking all actions (e.g., "moved Task #1 from In Progress -> In Review").
- **Notification**: Alerts delivered to users regarding task updates or deadlines.

---

## 🏗 Architectural Decisions

- **WebSocket Library**: We chose **Socket.io** due to its robust fallback mechanisms (long-polling), ease of room management, and built-in auto-reconnection features, which ensures reliable real-time updates for notifications and activity feeds.
- **Job Queue Choice**: For background tasks (like checking overdue tasks), we chose **node-cron**. Since the background jobs in this initial version are simplistic and time-based (e.g., ticking every hour), an in-memory cron scheduler was preferred over heavy Redis-backed queues (like BullMQ) to reduce infrastructure complexity.
- **Token Storage Approach**: Authentication employs a dual-token mechanism. The **Refresh Token** is safely stored in a secure, `HttpOnly` strict cookie to prevent XSS attacks. The short-lived **Access Token** is stored in memory/`localStorage` on the client side, balancing security with UX seamlessness (avoiding constant re-logins).

---

## ⚠️ Known Limitations
- Background jobs (run by `node-cron`) are strictly bound to the single active Node.js instance. Scaling horizontally to multiple server instances will cause duplicate job executions unless a centralized distributed queue (like BullMQ or Redis) is introduced.
- Complex role overlap edge-cases are currently limited; a user has a single strict role rather than granular, overlapping permissions.

---

## Explanation

**The hardest problem solved:** Ensuring that the real-time activity feed state perfectly synchronized with the database under heavy concurrent events without causing race conditions on the frontend UI. Stale data was mitigated by adopting an optimistic UI update technique on the client combined with definitive server confirmations.

**Handling the real-time role-filtered feed:** We handled this by creating specific *Socket.io rooms* based on user ID and user role (e.g., `room:admin`, `room:project_123`). When an event occurs (like a task update), the server determines the visibility boundaries of that event and only emits the payload to the specific rooms explicitly authorized to see it. This offloads the filtering logic to the server, keeping the client secure from receiving unauthorized data.

**One thing I'd do differently:** I would incorporate a dedicated in-memory datastore (like Redis) right from the beginning for caching and managing the WebSocket adapter state, simplifying future horizontal scaling for both real-time capabilities and cron jobs.
