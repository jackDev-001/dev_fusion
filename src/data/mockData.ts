import {
  User,
  Organization,
  Workspace,
  Project,
  Sprint,
  Task,
  WikiDoc,
  Meeting,
  ChatChannel,
  ChatMessage,
  Notification,
  AuditLog,
  WorkspaceAnalytics,
  AICopilotInsight
} from '../types';

export const CURRENT_USER: User = {
  id: 'usr_1',
  name: 'Aniket Vadhiya',
  email: 'aniket.vadhiya@acme.inc',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  role: 'OWNER',
  department: 'Engineering',
  title: 'Chief Technology Officer',
  capacityHoursPerWeek: 40
};

export const TEAM_MEMBERS: User[] = [
  CURRENT_USER,
  {
    id: 'usr_2',
    name: 'Akshita Patel',
    email: 'akshita.patel@acme.inc',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    role: 'ADMIN',
    department: 'Product',
    title: 'Lead System Architect',
    capacityHoursPerWeek: 40
  },
  {
    id: 'usr_3',
    name: 'Vinayak Gautam',
    email: 'vinayak.gautam@acme.inc',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'MEMBER',
    department: 'Engineering',
    title: 'Senior Backend Engineer',
    capacityHoursPerWeek: 40
  },
  {
    id: 'usr_4',
    name: 'Meet',
    email: 'meet@acme.inc',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    role: 'MEMBER',
    department: 'Engineering',
    title: 'Principal Frontend Engineer',
    capacityHoursPerWeek: 40
  },
  {
    id: 'usr_5',
    name: 'Jeet',
    email: 'jeet@acme.inc',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    role: 'MEMBER',
    department: 'DevOps',
    title: 'Lead Infrastructure Engineer',
    capacityHoursPerWeek: 40
  }
];

export const INITIAL_ORG: Organization = {
  id: 'org_1',
  name: 'Acme Global Technologies',
  slug: 'acme-global',
  logo: '⚡',
  plan: 'Enterprise Tier'
};

export const INITIAL_WORKSPACE: Workspace = {
  id: 'ws_1',
  orgId: 'org_1',
  name: 'Core Platform Engineering',
  description: 'Primary workspace for distributed platform microservices and AI engine',
  icon: '🚀'
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    workspaceId: 'ws_1',
    name: 'Nexus Cloud Infrastructure',
    key: 'NEX',
    description: 'Next-gen distributed multi-tenant kernel, OAuth gateway & AI pipeline',
    color: '#6366f1',
    leadId: 'usr_2',
    status: 'ON_TRACK',
    healthScore: 92,
    category: 'Backend'
  },
  {
    id: 'proj_2',
    workspaceId: 'ws_1',
    name: 'Omni AI Assistant & Copilot',
    key: 'AI',
    description: 'Autonomous project risk prediction, sprint velocity auto-balancing & summarization',
    color: '#8b5cf6',
    leadId: 'usr_1',
    status: 'AT_RISK',
    healthScore: 68,
    category: 'AI / Data'
  },
  {
    id: 'proj_3',
    workspaceId: 'ws_1',
    name: 'Mobile & Web Design System',
    key: 'DS',
    description: 'Unified accessible component library, light/dark themes & micro-interactions',
    color: '#ec4899',
    leadId: 'usr_5',
    status: 'ON_TRACK',
    healthScore: 95,
    category: 'Frontend'
  }
];

export const INITIAL_SPRINTS: Sprint[] = [
  {
    id: 'sprint_24',
    projectId: 'proj_1',
    name: 'Sprint 24 — High-Velocity Kernel',
    goal: 'Deploy multi-tenant security barrier, rate-limiting middleware & AICopilot v2',
    startDate: '2026-08-01',
    endDate: '2026-08-15',
    status: 'ACTIVE',
    totalPoints: 42,
    completedPoints: 28
  },
  {
    id: 'sprint_25',
    projectId: 'proj_1',
    name: 'Sprint 25 — Real-time WebSockets & Audit',
    goal: 'Zero-latency collaboration, GitHub Webhook triggers & Compliance audit logging',
    startDate: '2026-08-16',
    endDate: '2026-08-30',
    status: 'PLANNED',
    totalPoints: 38,
    completedPoints: 0
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    code: 'NEX-101',
    title: 'Implement Multi-Tenant Row-Level Security Middleware',
    description: 'Ensure Organization A context strictly isolates foreign queries. Implement middleware auth check with JWT workspace verification.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    projectId: 'proj_1',
    sprintId: 'sprint_24',
    assigneeId: 'usr_3',
    reporterId: 'usr_1',
    storyPoints: 8,
    estimatedHours: 16,
    loggedHours: 10,
    dueDate: '2026-08-14',
    tags: ['Security', 'Backend', 'Tenant-Isolation'],
    subtasks: [
      { id: 'sub_1', title: 'Write Organization Scope Auth Middleware', completed: true, assigneeId: 'usr_3' },
      { id: 'sub_2', title: 'Unit test cross-tenant query rejection', completed: true, assigneeId: 'usr_3' },
      { id: 'sub_3', title: 'Add database constraint benchmarks', completed: false, assigneeId: 'usr_3' }
    ],
    comments: [
      { id: 'cm_1', authorId: 'usr_1', content: 'Critical security requirement for Enterprise SOC2 compliance. Keep strict!', createdAt: '2026-08-10T10:15:00Z' }
    ],
    attachments: [
      { id: 'att_1', name: 'MultiTenant_Architecture_Spec.pdf', url: '#', size: '2.4 MB', uploadedAt: '2026-08-09T14:20:00Z' }
    ],
    aiRiskScore: 18,
    aiRiskReasoning: 'Progress is steady. Marcus has logged 10 hours and subtasks are 66% done.',
    createdAt: '2026-08-08T09:00:00Z',
    updatedAt: '2026-08-12T16:30:00Z'
  },
  {
    id: 'task_2',
    code: 'AI-204',
    title: 'Train Gemini Project Health & Risk Predictor Endpoint',
    description: 'Build backend API route `/api/ai/risk-analysis` using `@google/genai` to analyze task velocity, missing estimates, and imminent blockages.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    projectId: 'proj_2',
    sprintId: 'sprint_24',
    assigneeId: 'usr_2',
    reporterId: 'usr_1',
    storyPoints: 13,
    estimatedHours: 24,
    loggedHours: 18,
    dueDate: '2026-08-15',
    tags: ['AI', 'Gemini', 'Predictive-Analytics'],
    subtasks: [
      { id: 'sub_4', title: 'Construct workspace context serializer', completed: true, assigneeId: 'usr_2' },
      { id: 'sub_5', title: 'Integrate gemini-3.6-flash structured JSON response', completed: true, assigneeId: 'usr_2' },
      { id: 'sub_6', title: 'Add real-time action recommendation executor', completed: false, assigneeId: 'usr_2' }
    ],
    comments: [
      { id: 'cm_2', authorId: 'usr_2', content: 'Gemini model is producing instant risk scoring and actionable mitigation steps!', createdAt: '2026-08-12T11:45:00Z' }
    ],
    attachments: [],
    aiRiskScore: 35,
    aiRiskReasoning: 'Task is complex but lead engineer Elena is actively driving completion.',
    createdAt: '2026-08-09T08:30:00Z',
    updatedAt: '2026-08-13T08:00:00Z'
  },
  {
    id: 'task_3',
    code: 'NEX-105',
    title: 'Configure GitHub Webhook Sync for Pull Request Status',
    description: 'Auto-transition tasks from IN_PROGRESS to IN_REVIEW when a GitHub PR is opened referencing the task key (e.g., NEX-101).',
    status: 'TODO',
    priority: 'HIGH',
    projectId: 'proj_1',
    sprintId: 'sprint_24',
    assigneeId: 'usr_3',
    reporterId: 'usr_2',
    storyPoints: 5,
    estimatedHours: 10,
    loggedHours: 0,
    dueDate: '2026-08-14',
    tags: ['GitHub', 'Integration', 'Automation'],
    subtasks: [
      { id: 'sub_7', title: 'Create webhook signature verification endpoint', completed: false, assigneeId: 'usr_3' },
      { id: 'sub_8', title: 'Map PR status to task status transition logic', completed: false, assigneeId: 'usr_3' }
    ],
    comments: [],
    attachments: [],
    aiRiskScore: 78,
    aiRiskReasoning: 'CRITICAL RISK: Assignee Marcus is currently allocated 26 hours across active tasks, exceeding 40h capacity. High probability of delay.',
    createdAt: '2026-08-11T14:00:00Z',
    updatedAt: '2026-08-11T14:00:00Z'
  },
  {
    id: 'task_4',
    code: 'DS-301',
    title: 'Redesign Executive Command Center & Bento Dashboard Layout',
    description: 'Create high-density, accessible dashboard cards, project health indicators, and responsive command palette controls.',
    status: 'DONE',
    priority: 'MEDIUM',
    projectId: 'proj_3',
    sprintId: 'sprint_24',
    assigneeId: 'usr_5',
    reporterId: 'usr_4',
    storyPoints: 5,
    estimatedHours: 12,
    loggedHours: 12,
    dueDate: '2026-08-10',
    tags: ['UX', 'Tailwind', 'Design-System'],
    subtasks: [
      { id: 'sub_9', title: 'Figma layout tokens & color contrast check', completed: true, assigneeId: 'usr_5' },
      { id: 'sub_10', title: 'Tailwind v4 grid components & dark mode support', completed: true, assigneeId: 'usr_5' }
    ],
    comments: [],
    attachments: [],
    aiRiskScore: 0,
    aiRiskReasoning: 'Task is complete and verified.',
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-08-10T17:00:00Z'
  },
  {
    id: 'task_5',
    code: 'AI-208',
    title: 'Implement Notion-like Wiki Docs & AI Auto-Documenter',
    description: 'Allow team members to generate complete technical documentation, release notes, and architecture guides from workspace task history.',
    status: 'IN_REVIEW',
    priority: 'HIGH',
    projectId: 'proj_2',
    sprintId: 'sprint_24',
    assigneeId: 'usr_4',
    reporterId: 'usr_1',
    storyPoints: 8,
    estimatedHours: 14,
    loggedHours: 14,
    dueDate: '2026-08-13',
    tags: ['Docs', 'AI', 'Notion-Wiki'],
    subtasks: [
      { id: 'sub_11', title: 'Rich markdown editor with block structure', completed: true, assigneeId: 'usr_4' },
      { id: 'sub_12', title: 'AI doc generation prompt pipeline', completed: true, assigneeId: 'usr_4' }
    ],
    comments: [
      { id: 'cm_3', authorId: 'usr_4', content: 'Submitted PR for code review! Tested doc generation on 5 past sprints.', createdAt: '2026-08-13T08:30:00Z' }
    ],
    attachments: [],
    aiRiskScore: 12,
    aiRiskReasoning: 'In review. High quality PR ready for approval.',
    createdAt: '2026-08-07T11:00:00Z',
    updatedAt: '2026-08-13T08:30:00Z'
  },
  {
    id: 'task_6',
    code: 'NEX-109',
    title: 'Setup Global Search (⌘K Command Palette) across workspace',
    description: 'Provide instant fuzzy search over tasks, wiki documents, meetings, team chat channels, and members.',
    status: 'BACKLOG',
    priority: 'LOW',
    projectId: 'proj_1',
    assigneeId: 'usr_3',
    reporterId: 'usr_1',
    storyPoints: 3,
    estimatedHours: 6,
    loggedHours: 0,
    dueDate: '2026-08-20',
    tags: ['Search', 'Productivity'],
    subtasks: [],
    comments: [],
    attachments: [],
    aiRiskScore: 5,
    aiRiskReasoning: 'In backlog, low urgency.',
    createdAt: '2026-08-12T09:00:00Z',
    updatedAt: '2026-08-12T09:00:00Z'
  }
];

export const INITIAL_WIKI_DOCS: WikiDoc[] = [
  {
    id: 'doc_1',
    workspaceId: 'ws_1',
    title: 'Nexus Platform Architecture & Multi-Tenant Blueprint',
    content: `# Nexus Workspace Architecture Blueprint

## Executive Overview
Nexus Workspace is designed as a high-concurrency, multi-tenant enterprise operating system for modern software engineering organizations.

### Key Pillars
1. **Strict Tenant Isolation**: Row-level tenant identification on all database queries.
2. **Unified Intelligence**: Server-side Gemini AI engine analyzing sprints, risks, and pull requests in real time.
3. **Sub-second Collaboration**: Integrated Slack-like channels, Notion-like docs, Jira-like board, and Google Calendar sync.

\`\`\`
Client UI (React + Tailwind) <--> Rest API Gateway <--> Express + Server Gemini AI <--> Multi-Tenant Data Store
\`\`\`
`,
    authorId: 'usr_2',
    category: 'Architecture',
    updatedAt: '2026-08-12T15:00:00Z',
    tags: ['Architecture', 'Security', 'Enterprise'],
    pinned: true
  },
  {
    id: 'doc_2',
    workspaceId: 'ws_1',
    title: 'Sprint 24 Retrospective & Release Plan',
    content: `# Sprint 24 Retrospective

### Accomplishments
* 28 / 42 Story Points Completed
* Zero security vulnerabilities found in multi-tenant audit
* AI Risk engine successfully flagged 2 resource over-allocations

### Next Steps
1. Finalize GitHub webhook sync for NEX-105
2. Deploy v2.4 image container to Cloud Run
`,
    authorId: 'usr_4',
    category: 'Engineering',
    updatedAt: '2026-08-13T07:30:00Z',
    tags: ['Sprint', 'Retrospective'],
    pinned: false
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet_1',
    workspaceId: 'ws_1',
    title: 'Weekly Engineering Architecture Sync & AI Health Review',
    startTime: '2026-08-13T10:00:00Z',
    endTime: '2026-08-13T10:45:00Z',
    organizerId: 'usr_1',
    attendeeIds: ['usr_1', 'usr_2', 'usr_3', 'usr_4'],
    meetUrl: 'https://meet.nexus.inc/arch-sync',
    notes: 'Discussed row-level isolation benchmark, sprint 24 risk prediction, and AI Copilot automated task dispatch.',
    summary: 'The team agreed on strict RBAC enforcement for Organization boundaries and prioritized Marcus’s workload mitigation.',
    actionItems: [
      'Marcus: Reassign NEX-105 subtask 2 or request assistance',
      'Elena: Deploy Gemini risk scoring endpoint to production',
      'Alex: Finalize SOC2 audit log schema'
    ],
    status: 'UPCOMING'
  },
  {
    id: 'meet_2',
    workspaceId: 'ws_1',
    title: 'Sprint 25 Planning & Capacity Alignment',
    startTime: '2026-08-16T14:00:00Z',
    endTime: '2026-08-16T15:00:00Z',
    organizerId: 'usr_4',
    attendeeIds: ['usr_1', 'usr_2', 'usr_3', 'usr_4', 'usr_5'],
    meetUrl: 'https://meet.nexus.inc/sprint-25-plan',
    notes: 'Review backlog items, story point estimations, and assign sprint goals.',
    status: 'UPCOMING'
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  { id: 'ch_1', workspaceId: 'ws_1', name: 'general-announcements', type: 'PUBLIC', topic: 'Company-wide updates & platform releases', membersCount: 24 },
  { id: 'ch_2', workspaceId: 'ws_1', name: 'proj-nexus-kernel', type: 'PUBLIC', topic: 'Core infrastructure & security discussions', membersCount: 12 },
  { id: 'ch_3', workspaceId: 'ws_1', name: 'ai-copilot-dev', type: 'PUBLIC', topic: 'Gemini integration & risk model tuning', membersCount: 8 },
  { id: 'ch_4', workspaceId: 'ws_1', name: 'incidents-war-room', type: 'PRIVATE', topic: 'Production alerts & rapid response', membersCount: 6 }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    channelId: 'ch_2',
    senderId: 'usr_2',
    content: 'All row-level security tests for Acme Org isolation are green on branch `feature/rls-guard`.',
    timestamp: '2026-08-13T08:15:00Z'
  },
  {
    id: 'msg_2',
    channelId: 'ch_2',
    senderId: 'usr_3',
    content: 'Awesome Elena! I am reviewing the PR now. Benchmarks show <2ms overhead.',
    timestamp: '2026-08-13T08:22:00Z'
  },
  {
    id: 'msg_3',
    channelId: 'ch_3',
    senderId: 'usr_1',
    content: '@NexusAI Can you run an automated risk assessment on Sprint 24?',
    timestamp: '2026-08-13T08:40:00Z'
  },
  {
    id: 'msg_4',
    channelId: 'ch_3',
    senderId: 'ai_bot',
    content: '⚡ **Nexus AI Risk Report for Sprint 24**:\n- **Overall Sprint Health**: 78/100 (At Moderate Risk)\n- **Resource Bottleneck Detected**: Marcus Chen has 3 active tasks totaling 26 planned hours due in 48h.\n- **Recommended Action**: Reassign task `NEX-105` (GitHub Webhooks) to Elena Rostova or extend target date to Aug 18.',
    timestamp: '2026-08-13T08:40:05Z',
    isAiResponse: true
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'usr_1',
    title: 'AI Risk Alert — Marcus Chen Overallocated',
    message: 'Sprint 24 velocity indicates high risk of missing NEX-105 deadline due to developer overload.',
    type: 'RISK_ALERT',
    read: false,
    createdAt: '2026-08-13T08:40:00Z',
    link: 'sprint'
  },
  {
    id: 'notif_2',
    userId: 'usr_1',
    title: 'Pull Request Review Requested',
    message: 'Sarah Jenkins requested your review on "AI Notion Docs Generator (AI-208)"',
    type: 'TASK_ASSIGNED',
    read: false,
    createdAt: '2026-08-13T08:30:00Z',
    link: 'kanban'
  },
  {
    id: 'notif_3',
    userId: 'usr_1',
    title: 'Upcoming Meeting in 15 mins',
    message: 'Weekly Engineering Architecture Sync & AI Health Review starts at 10:00 AM.',
    type: 'MEETING_REMINDER',
    read: true,
    createdAt: '2026-08-13T09:45:00Z',
    link: 'meetings'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud_1', actorName: 'Alex Vance', action: 'ORGANIZATION_POLICY_UPDATE', target: 'Enforced Multi-Factor Authentication', timestamp: '2026-08-12T16:00:00Z', ipAddress: '192.168.1.102' },
  { id: 'aud_2', actorName: 'Elena Rostova', action: 'ROLE_PROMOTION', target: 'Marcus Chen promoted to Senior Developer', timestamp: '2026-08-11T12:30:00Z', ipAddress: '192.168.1.108' },
  { id: 'aud_3', actorName: 'System Kernel', action: 'AI_RISK_SWEEP_EXECUTED', target: 'Scanned 6 active workspace projects', timestamp: '2026-08-13T08:00:00Z', ipAddress: '127.0.0.1' }
];

export const INITIAL_ANALYTICS: WorkspaceAnalytics = {
  velocity: [22, 28, 31, 35, 28, 42],
  cycleTimeDays: 3.2,
  completedTasksThisSprint: 8,
  openRisksCount: 2,
  teamProductivityScore: 94,
  workloadDistribution: [
    { userId: 'usr_3', userName: 'Marcus Chen', allocatedHours: 36, capacityHours: 40 },
    { userId: 'usr_2', userName: 'Elena Rostova', allocatedHours: 28, capacityHours: 40 },
    { userId: 'usr_4', userName: 'Sarah Jenkins', allocatedHours: 22, capacityHours: 40 },
    { userId: 'usr_5', userName: 'Devon Wright', allocatedHours: 18, capacityHours: 40 }
  ]
};

export const INITIAL_AI_INSIGHTS: AICopilotInsight[] = [
  {
    id: 'ins_1',
    title: 'Developer Overload Bottleneck in Sprint 24',
    type: 'RISK',
    severity: 'HIGH',
    description: 'Marcus Chen is assigned 3 critical tasks (26 hrs remaining) with 2 days left in Sprint 24. High likelihood of missing NEX-105.',
    actionLabel: 'Auto-Reassign NEX-105 to Elena',
    actionPayload: { taskId: 'task_3', newAssigneeId: 'usr_2' }
  },
  {
    id: 'ins_2',
    title: 'Meeting Notes Ready for Task Extraction',
    type: 'ACTION',
    severity: 'MEDIUM',
    description: 'Architecture sync meeting contains 3 unassigned action items. AI can parse and convert them into structured backlog tasks.',
    actionLabel: 'Extract 3 Action Tasks',
    actionPayload: { meetingId: 'meet_1' }
  },
  {
    id: 'ins_3',
    title: 'Documentation Outdated for Project AI-Copilot',
    type: 'OPTIMIZATION',
    severity: 'LOW',
    description: 'Project NEX has had 4 closed PRs since last architecture wiki update. Auto-generate documentation update.',
    actionLabel: 'Generate Architecture Doc',
    actionPayload: { projectId: 'proj_2' }
  }
];
