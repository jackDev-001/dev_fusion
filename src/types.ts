export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  department: string;
  title: string;
  capacityHoursPerWeek: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string;
  plan: 'Enterprise Tier' | 'Pro' | 'Starter';
}

export interface Workspace {
  id: string;
  orgId: string;
  name: string;
  description: string;
  icon: string;
}

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  code: string; // e.g. "NEX-101"
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  sprintId?: string;
  assigneeId: string;
  reporterId: string;
  storyPoints: number;
  estimatedHours: number;
  loggedHours: number;
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
  attachments: TaskAttachment[];
  aiRiskScore?: number; // 0 to 100
  aiRiskReasoning?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
  totalPoints: number;
  completedPoints: number;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  key: string; // e.g. "NEX"
  description: string;
  color: string;
  leadId: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'COMPLETED';
  healthScore: number; // 0-100
  category: string;
}

export interface WikiDoc {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  authorId: string;
  category: 'Engineering' | 'Product' | 'Architecture' | 'Onboarding' | 'General';
  updatedAt: string;
  tags: string[];
  pinned?: boolean;
}

export interface Meeting {
  id: string;
  workspaceId: string;
  title: string;
  startTime: string;
  endTime: string;
  organizerId: string;
  attendeeIds: string[];
  meetUrl: string;
  notes: string;
  summary?: string;
  actionItems?: string[];
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  isAiResponse?: boolean;
}

export interface ChatChannel {
  id: string;
  workspaceId: string;
  name: string;
  type: 'PUBLIC' | 'PRIVATE' | 'DM';
  topic: string;
  membersCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'TASK_ASSIGNED' | 'RISK_ALERT' | 'MENTION' | 'MEETING_REMINDER' | 'SYSTEM';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface TimeLog {
  id: string;
  taskId: string;
  userId: string;
  hours: number;
  description: string;
  date: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface WorkspaceAnalytics {
  velocity: number[];
  cycleTimeDays: number;
  completedTasksThisSprint: number;
  openRisksCount: number;
  teamProductivityScore: number;
  workloadDistribution: { userId: string; userName: string; allocatedHours: number; capacityHours: number }[];
}

export interface AICopilotInsight {
  id: string;
  title: string;
  type: 'RISK' | 'OPTIMIZATION' | 'SUMMARY' | 'ACTION';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  actionLabel?: string;
  actionPayload?: any;
}
