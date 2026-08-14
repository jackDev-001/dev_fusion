# Nexus Workspace (Nexus OS)
> **Unified Enterprise Project Management, Agile Collaboration & Operations Platform**

[![Live App](https://img.shields.io/badge/Live%20Demo-Google%20Cloud%20Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://ais-pre-sw6yp4kyomy3lpijro67cx-903624546103.asia-east1.run.app)
[![Built with React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TailwindCSS%20v4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

---

## 📌 Problem Statement & Motivation

### Chosen Track / Problem Statement:
**Next-Generation Enterprise Collaboration & Unified Project Management OS**

Modern engineering and product teams suffer from severe tool fragmentation:
- **Jira / Linear** for issue tracking and backlog management
- **Notion / Confluence** for technical documentation and wiki pages
- **Slack / Teams** for real-time team communication
- **Google Meet / Zoom** for meeting notes and sync agendas

Context-switching across 4–5 disconnected tools leads to missed action items, unmonitored sprint bottlenecks, overloaded engineers, and delayed delivery cycles. 

**Nexus Workspace** solves this by consolidating sprint planning, agile Kanban tracking, technical documentation, meeting summaries, and real-time team communication into a **single unified operating system**, complete with an automated **Operations & Workload Telemetry Engine** that proactively monitors project health, predicts delivery bottlenecks, and auto-balances team allocations.

---

## 🚀 What the Application Does

Nexus Workspace functions as an all-in-one executive command center and engineering workspace:

1. **Executive Command Center:** Real-time visibility into active sprint velocity, delivery burn-down, project health scores, and dynamic developer capacity heatmaps.
2. **Agile Kanban Board:** Interactive sprint board supporting live status transitions (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`), story points, subtask checklists, and priority indicators.
3. **Predictive Risk & Health Engine:** Proactively calculates risk scores (0–100%) on every task based on developer workload, estimate accuracy, and approaching deadlines, featuring 1-click automatic workload rebalancing.
4. **Technical Wiki & Documentation Builder:** Rich markdown knowledge base where teams can draft technical specifications, architecture blueprints, SLA guidelines, and structured code templates.
5. **Meeting Intelligence Hub:** Captures meeting transcripts and converts discussions into actionable sprint backlog tasks with a single click.
6. **Integrated Team Chat:** Multi-channel real-time discussion spaces (`#general-announcements`, `#proj-nexus-kernel`, `#sprint-automation`, `#incidents-war-room`) with automated operations bot assistance.
7. **Security & Audit Trail:** Real-time immutable audit logging for enterprise governance and compliance tracking.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Styling:** Tailwind CSS v4 (Luminous high-contrast theme, responsive Bento grids)
- **Icons:** Lucide React
- **Animations:** Motion (`motion/react`)
- **Build Tool:** Vite 6

### Backend
- **Server:** Node.js with Express 4 (TypeScript)
- **Execution & Bundler:** `tsx` for direct TypeScript development runtime, `esbuild` for single-bundle CommonJS production server output
- **Architecture:** Full-stack client-server architecture with protected REST API routes (`/api/*`)

### Database & Storage
- **State Engine:** Server-authoritative in-memory REST state store with real-time state synchronization and automated audit trail tracking

### Deployment & Infrastructure
- **Containerization:** Production Docker runtime
- **Hosting Platform:** Google Cloud Run (Serverless container deployment)

---

## 💻 Step-by-Step Instructions to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (version 9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd nexus-workspace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
The server will start at: **`http://localhost:3000`**

### 4. Build for Production
```bash
# Compile frontend with Vite and bundle backend with esbuild
npm run build

# Launch the production CommonJS bundle
npm start
```

---

## ✨ Features Built

| Module | Features & Capabilities |
| :--- | :--- |
| **Executive Command Center** | Live velocity gauges, 66% sprint completion indicators, critical bottleneck alerts, real-time workload allocation heatmaps (hours allocated vs. weekly capacity), and live security audit log streams. |
| **Agile Kanban Board** | Multi-column agile board (`Backlog` → `Done`), priority tags (`URGENT`, `HIGH`, `MEDIUM`, `LOW`), project & assignee filter dropdowns, subtask completion trackers, and detailed task modal. |
| **Operations Engine & Risk Radar** | Workload telemetry analyzer that evaluates delivery risks, diagnoses team overload, calculates story point budgets, and provides actionable recommendations. |
| **1-Click Workload Rebalancer** | Automated detection of developer bottlenecks (e.g., developer overallocated) with a 1-click action button that reassigns tasks and updates the audit log. |
| **Wiki Docs & Spec Builder** | Categorized markdown viewer/editor with pinned articles, tags, and a technical specification generator that drafts full architectural documentation. |
| **Meeting Intelligence** | Meeting minutes repository with 1-click **"Extract Action Items to Sprint"** feature that auto-generates structured task cards into the sprint backlog. |
| **Team Chat & Channels** | Topic channels (`#general-announcements`, `#proj-nexus-kernel`, `#sprint-automation`, `#incidents-war-room`) with real-time messaging and operations bot commands. |
| **Global Quick Search (⌘K)** | Global fuzzy search modal accessible via `⌘K` or the top search bar across all tasks, docs, and channels. |
| **Enterprise Security & Roles** | Multi-role user model (`OWNER`, `ADMIN`, `MEMBER`), department categorization, and complete immutable audit trail. |

---

## 🌐 Live Deployment Link

- **Live Application URL:** [https://ais-pre-sw6yp4kyomy3lpijro67cx-903624546103.asia-east1.run.app](https://ais-pre-sw6yp4kyomy3lpijro67cx-903624546103.asia-east1.run.app)
- **Development Preview URL:** [https://ais-dev-sw6yp4kyomy3lpijro67cx-903624546103.asia-east1.run.app](https://ais-dev-sw6yp4kyomy3lpijro67cx-903624546103.asia-east1.run.app)

---

## 👥 Team Members & Roles

| Member Name | Project Role | Responsibilities |
| :--- | :--- | :--- |
| **Aniket Vadhiya** | **Project Lead & Full Stack Architect (Owner / CTO)** | Overall architecture, full-stack Express & React implementation, telemetry algorithms, and UI/UX design. |
| **Akshita Patel** | **Product Architect & UX Lead** | Product requirement definition, user workflow mapping, Kanban sprint board UX design, and backlog workflows. |
| **Vinayak Gautam** | **Backend & Systems Engineer** | REST API endpoints, automated risk & workload calculation logic, and server-side data models. |
| **Meet** | **Principal Frontend Engineer** | Interactive UI components, Bento grid responsive layouts, Motion animations, and theme polish. |
| **Jeet** | **Lead Infrastructure & DevOps Engineer** | Cloud Run deployment, container optimization, build pipelines, security policies, and audit logging. |

---

## 🔍 Known Bugs & Limitations (Honest Transparency)

1. **In-Memory State Persistence:** The application currently maintains state in a server-side in-memory store for instant responsiveness during demonstrations. If the cloud container completely restarts or cold-boots, modifications reset back to the baseline initial state (can be easily connected to persistent Cloud Firestore or PostgreSQL / Cloud SQL).
2. **Simulated File Attachments:** Task and Wiki attachment upload dialogs simulate file attachments locally within the application state; an external object storage service (such as Google Cloud Storage or AWS S3) is not hooked up for raw binary persistence.
3. **Polling / Optimistic State vs. WebSockets:** Real-time updates between team views use optimistic client-server REST synchronization rather than a full dedicated WebSocket/SSE daemon.
4. **Local Network Port Binding:** In local environments, the backend dev server binds to port 3000 as configured for full-stack Node environments.

