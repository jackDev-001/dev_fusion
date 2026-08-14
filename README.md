# Nexus Workspace (Nexus OS)
> **Unified Enterprise Project Management, Collaboration & AI Autonomous Command Center**

[![Live App](https://img.shields.io/badge/Live%20Demo-Google%20Cloud%20Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://ais-pre-sw6yp4kyomy3lpijro67cx-903624546103.asia-east1.run.app)
[![Built with React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TailwindCSS%20v4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Powered by Gemini](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%203.6%20Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

## 📌 Problem Statement & Motivation

### Chosen Track / Problem Statement:
**Next-Generation Enterprise Collaboration & Autonomous Project Management OS**

Modern engineering and product teams suffer from severe tool fragmentation:
- **Jira / Linear** for issue tracking
- **Notion / Confluence** for documentation
- **Slack / Teams** for communications
- **Google Meet / Zoom** for meeting notes

Context-switching across 4–5 disconnected tools leads to missed action items, unmonitored sprint bottlenecks, overloaded engineers, and delayed delivery. 

**Nexus Workspace** solves this by consolidating sprint planning, agile Kanban tracking, technical documentation, meeting summaries, and real-time team chat into a **single unified operating system**, powered by an autonomous **Gemini AI CTO Copilot** that proactively monitors project health, predicts delivery risks, and auto-balances team workloads.

---

## 🚀 What the Application Does

Nexus Workspace functions as an all-in-one executive command center and engineering workspace:

1. **Executive Command Center:** Real-time visibility into active sprint velocity, delivery burn-down, project health scores, and dynamic developer capacity heatmaps.
2. **Agile Kanban Board:** Interactive sprint board supporting live status transitions (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`), story points, subtask checklists, and priority indicators.
3. **Gemini AI Risk Radar:** Proactively calculates risk scores (0–100%) on every task based on developer workload, estimate accuracy, and approaching deadlines. Features 1-click automatic workload rebalancing.
4. **Notion-Style Wiki & AI Auto-Documenter:** Rich markdown knowledge base where teams can draft technical specifications or use Gemini AI to generate production-ready architectural documentation, SLA guidelines, and code templates in seconds.
5. **Meeting Intelligence Hub:** Captures meeting transcripts and converts discussions into actionable sprint tasks with a single click.
6. **Integrated Team Chat:** Multi-channel real-time discussion spaces (`#general`, `#engineering`, `#product-design`, `#incidents`) with AI assistant integration.
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

### AI & Third-Party APIs
- **AI SDK:** `@google/genai` (Google Gen AI TypeScript SDK)
- **Model:** `gemini-3.6-flash` (used for autonomous copilot queries, risk scoring, sprint task generation, and technical documentation drafting)
- **Deployment Platform:** Google Cloud Run (Containerized environment)

---

## 💻 Step-by-Step Instructions to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (version 9.0.0 or higher)
- A [Google Gemini API Key](https://aistudio.google.com/) *(optional — fallback heuristic mode is built-in if no key is provided)*

### 1. Clone the Repository
```bash
git clone <repository-url>
cd nexus-workspace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env
```
Inside `.env`, configure your API key:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 4. Start the Development Server
```bash
npm run dev
```
The server will start at: **`http://localhost:3000`**

### 5. Build for Production (Optional)
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
| **AI CTO Copilot & Risk Radar** | Gemini-driven autonomous assistant that evaluates delivery risks, diagnoses team overload, suggests sprint task decompositions, and provides actionable recommendations. |
| **1-Click AI Workload Rebalance** | Automated detection of developer bottlenecks (e.g., Marcus Chen overloaded) with a 1-click action button that reassigns tasks and updates the audit log. |
| **Notion-Style Wiki Docs** | Categorized markdown viewer/editor with pinned articles, tags, and an **AI Auto-Documenter** modal that drafts full technical architectural specs. |
| **Meeting Intelligence** | Meeting minutes repository with 1-click **"Extract Action Items to Sprint"** feature that auto-generates structured task cards. |
| **Team Chat & Channels** | Topic channels (`#engineering`, `#product-design`, `#incidents`) with real-time message sending and AI bot mentions. |
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
| **Aniket Vadhiya** | **Project Lead & Full Stack Architect (Owner / CTO)** | System design, full-stack Express & React architecture, Gemini AI integration, UI/UX polish. |
| **Akshita Patel** | **Product Architect & UX Lead** | Product requirement definition, user workflow mapping, Kanban sprint board UX design. |
| **Vinayak Gautam** | **Backend & AI Systems Engineer** | REST API endpoints, autonomous risk prediction engine, server-side data models. |
| **Meet** | **Principal Frontend Engineer** | Interactive UI components, Bento grid responsive layouts, Motion animations, theme design. |
| **Jeet** | **Lead Infrastructure & DevOps Engineer** | Cloud Run deployment, container optimization, build automation, security & audit logs. |

---

## 🔍 Known Bugs & Limitations (Honest Transparency)

1. **In-Memory State Persistence:** The application currently maintains state in a server-side in-memory store for instant responsiveness during demonstrations. If the cloud container completely restarts or cold-boots, modifications reset back to the baseline mock state (can be easily connected to persistent Cloud Firestore or PostgreSQL / Cloud SQL).
2. **Simulated File Attachments:** Task and Wiki attachment upload dialogs simulate file attachments locally within the application state; an external object storage service (such as Google Cloud Storage or AWS S3) is not hooked up for raw binary persistence.
3. **Polling / Optimistic State vs. WebSockets:** Real-time updates between team views use optimistic client-server REST synchronization rather than a full dedicated WebSocket/SSE daemon.
4. **AI Key Fallback Mode:** In environments where `GEMINI_API_KEY` is not provided, the system gracefully falls back to deterministic local intelligence heuristics so that the user interface never crashes or blocks.
