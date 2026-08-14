import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProjectKanbanView } from './components/ProjectKanbanView';
import { WikiDocsView } from './components/WikiDocsView';
import { MeetingsView } from './components/MeetingsView';
import { TeamChatView } from './components/TeamChatView';
import { AnalyticsView } from './components/AnalyticsView';
import { AdminPanel } from './components/AdminPanel';
import { BillingPaymentView } from './components/BillingPaymentView';
import { LoginPage } from './components/LoginPage';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { CreateTaskModal } from './components/CreateTaskModal';

import {
  fetchWorkspaceState,
  createTaskApi,
  updateTaskApi,
  addCommentApi,
  createDocApi,
  sendMessageApi,
  markNotificationReadApi,
  applyAiActionApi,
  sendCopilotPromptApi,
  generateAiDocApi
} from './services/api';

import {
  CURRENT_USER,
  INITIAL_ORG,
  INITIAL_WORKSPACE,
  INITIAL_PROJECTS,
  INITIAL_SPRINTS,
  INITIAL_TASKS,
  INITIAL_WIKI_DOCS,
  INITIAL_MEETINGS,
  INITIAL_CHANNELS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANALYTICS,
  INITIAL_AI_INSIGHTS,
  INITIAL_INVOICES,
  INITIAL_PAYMENT_METHODS
} from './data/mockData';

import {
  Organization,
  Workspace,
  User,
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
  AICopilotInsight,
  Invoice,
  PaymentMethod
} from './types';

export default function App() {
  // Authentication session state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('nexus_auth_user');
      return saved ? JSON.parse(saved) : CURRENT_USER;
    } catch (e) {
      return CURRENT_USER;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nexus_logged_out') !== 'true';
    } catch (e) {
      return true;
    }
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');

  // State initialization with fallbacks
  const [org, setOrg] = useState<Organization>(INITIAL_ORG);
  const [workspace, setWorkspace] = useState<Workspace>(INITIAL_WORKSPACE);
  const [members, setMembers] = useState<User[]>([CURRENT_USER]);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [sprints, setSprints] = useState<Sprint[]>(INITIAL_SPRINTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [wikiDocs, setWikiDocs] = useState<WikiDoc[]>(INITIAL_WIKI_DOCS);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [channels, setChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [analytics, setAnalytics] = useState<WorkspaceAnalytics>(INITIAL_ANALYTICS);
  const [aiInsights, setAiInsights] = useState<AICopilotInsight[]>(INITIAL_AI_INSIGHTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);

  // Modals & Drawers
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Keyboard Shortcuts (⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch live state from Express backend
  useEffect(() => {
    fetchWorkspaceState()
      .then((data) => {
        if (data.org) setOrg(data.org);
        if (data.workspace) setWorkspace(data.workspace);
        if (data.members) setMembers(data.members);
        if (data.projects) setProjects(data.projects);
        if (data.sprints) setSprints(data.sprints);
        if (data.tasks) setTasks(data.tasks);
        if (data.wikiDocs) setWikiDocs(data.wikiDocs);
        if (data.meetings) setMeetings(data.meetings);
        if (data.channels) setChannels(data.channels);
        if (data.messages) setMessages(data.messages);
        if (data.notifications) setNotifications(data.notifications);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        if (data.analytics) setAnalytics(data.analytics);
        if (data.aiInsights) setAiInsights(data.aiInsights);
      })
      .catch(() => {
        console.log('Running in client state mode');
      });
  }, []);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('nexus_auth_user', JSON.stringify(user));
      localStorage.removeItem('nexus_logged_out');
    } catch (e) {}

    // Add audit log entry
    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        actorName: user.name,
        action: 'CREDENTIAL_AUTHENTICATED',
        target: 'Enterprise Workspace Session',
        timestamp: new Date().toLocaleTimeString(),
        ipAddress: '192.168.1.108 (TLS 256-Bit)'
      },
      ...prev
    ]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('nexus_logged_out', 'true');
    } catch (e) {}
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('nexus_auth_user', JSON.stringify(user));
    } catch (e) {}
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: user.id,
        title: 'Active Session Switched',
        message: `You are now interacting as ${user.name} (${user.title}).`,
        type: 'SYSTEM',
        read: false,
        createdAt: 'Just now'
      },
      ...prev
    ]);
  };

  // Payment & Plan Handlers
  const handlePlanUpdated = (newPlan: 'Starter' | 'Pro' | 'Enterprise Tier', invoice: Invoice, newSeats: number) => {
    setOrg((prev) => ({
      ...prev,
      plan: newPlan,
      seatsCount: newSeats,
      renewalDate: '2026-09-01'
    }));

    setInvoices((prev) => [invoice, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        actorName: currentUser.name,
        action: 'SUBSCRIPTION_UPGRADED',
        target: `${newPlan} (${newSeats} Seats) - Ref: ${invoice.invoiceNumber}`,
        timestamp: new Date().toLocaleTimeString(),
        ipAddress: '192.168.1.108'
      },
      ...prev
    ]);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'Subscription Successfully Activated',
        message: `Your organization ${org.name} has been upgraded to ${newPlan} with ${newSeats} team licenses.`,
        type: 'SYSTEM',
        read: false,
        createdAt: 'Just now'
      },
      ...prev
    ]);
  };

  const handleAddPaymentMethod = (newPm: PaymentMethod) => {
    setPaymentMethods((prev) => [newPm, ...prev]);
  };

  // Task & Content Handlers
  const handleTaskUpdate = async (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      await updateTaskApi(id, updates);
    } catch (e) {
      // Local optimistic update remains intact
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const created = await createTaskApi(taskData);
      setTasks((prev) => [created, ...prev]);
    } catch (e) {
      const fallbackTask: Task = {
        id: `task_${Date.now()}`,
        code: `NEX-${100 + tasks.length + 1}`,
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'TODO',
        priority: taskData.priority || 'MEDIUM',
        projectId: taskData.projectId || projects[0]?.id || 'proj_1',
        assigneeId: taskData.assigneeId || currentUser.id,
        reporterId: currentUser.id,
        storyPoints: Number(taskData.storyPoints) || 3,
        estimatedHours: Number(taskData.estimatedHours) || 8,
        loggedHours: 0,
        dueDate: taskData.dueDate || '2026-08-25',
        tags: taskData.tags || ['Feature'],
        subtasks: [],
        comments: [],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTasks((prev) => [fallbackTask, ...prev]);
    }
  };

  const handleAddComment = async (taskId: string, content: string) => {
    try {
      const comment = await addCommentApi(taskId, content);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, comments: [...t.comments, comment] }
            : t
        )
      );
    } catch (e) {
      const fallbackComment = {
        id: `comm_${Date.now()}`,
        authorId: currentUser.id,
        content,
        createdAt: 'Just now'
      };
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, comments: [...t.comments, fallbackComment] }
            : t
        )
      );
    }
  };

  const handleSendMessage = async (channelId: string, content: string) => {
    try {
      const msg = await sendMessageApi(channelId, content);
      setMessages((prev) => [...prev, msg]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        channelId,
        senderId: currentUser.id,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleApplyAiAction = async (actionPayload: any) => {
    try {
      const result = await applyAiActionApi(actionPayload.type || 'REASSIGN_TASK', actionPayload);
      if (result.type === 'REASSIGN_TASK' && result.task) {
        setTasks((prev) => prev.map((t) => (t.id === result.task.id ? result.task : t)));
      } else if (result.type === 'EXTRACT_TASKS' && result.tasks) {
        setTasks((prev) => [...result.tasks, ...prev]);
      }
    } catch (e) {
      if (actionPayload.taskId && actionPayload.newAssigneeId) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === actionPayload.taskId
              ? {
                  ...t,
                  assigneeId: actionPayload.newAssigneeId,
                  aiRiskScore: Math.max(10, (t.aiRiskScore || 50) - 40)
                }
              : t
          )
        );
      }
    }
  };

  const handleGenerateAiDoc = async (title: string, category: string, prompt: string) => {
    try {
      const generated = await generateAiDocApi(title, category, prompt);
      setWikiDocs((prev) => [generated, ...prev]);
    } catch (e) {
      const fallbackDoc: WikiDoc = {
        id: `doc_${Date.now()}`,
        workspaceId: workspace.id,
        title: title || 'Architecture Specification',
        content: `# ${title || 'Architecture Specification'}\n\nAutomated technical specification generated for **${org.name}**.\n\n## 1. System Overview\nHigh-throughput distributed services with automated workload risk telemetry and fault isolation.\n\n## 2. API Contract & Data Model\n- Protocol: RESTful & WebSocket real-time event pipeline\n- Authentication: TLS 256-bit & RBAC token verification\n- Persistence: Scalable multi-tenant tenant isolation\n\n## 3. Deployment & Scalability\nZero-downtime rolling container updates with automated health monitoring.`,
        authorId: currentUser.id,
        category: (category as any) || 'Architecture',
        updatedAt: new Date().toISOString(),
        tags: ['Architecture', 'Autogenerated']
      };
      setWikiDocs((prev) => [fallbackDoc, ...prev]);
    }
  };

  // If user is not authenticated or logged out, show the Credentials Login / Sign Up page
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        org={org}
        workspace={workspace}
        currentUser={currentUser}
        teamMembers={members}
        notifications={notifications}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        onMarkNotificationRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
          markNotificationReadApi(id);
        }}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Workspace App Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          activeRisksCount={tasks.filter((t) => (t.aiRiskScore || 0) >= 50).length}
          unreadChatCount={1}
        />

        {/* View Router Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          {currentView === 'dashboard' && (
            <DashboardView
              projects={projects}
              activeSprint={sprints[0]}
              tasks={tasks}
              members={members}
              aiInsights={aiInsights}
              auditLogs={auditLogs}
              analytics={analytics}
              onNavigate={setCurrentView}
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
              onApplyAiAction={handleApplyAiAction}
              onOpenCopilot={() => setIsCopilotOpen(true)}
            />
          )}

          {currentView === 'kanban' && (
            <ProjectKanbanView
              tasks={tasks}
              projects={projects}
              members={members}
              sprints={sprints}
              onTaskUpdate={handleTaskUpdate}
              onAddComment={handleAddComment}
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
            />
          )}

          {currentView === 'docs' && (
            <WikiDocsView
              wikiDocs={wikiDocs}
              members={members}
              onCreateDoc={(docData) =>
                setWikiDocs((prev) => [
                  {
                    id: `doc_${Date.now()}`,
                    workspaceId: workspace.id,
                    title: docData.title || 'Untitled',
                    content: docData.content || '',
                    authorId: currentUser.id,
                    category: docData.category || 'Engineering',
                    updatedAt: new Date().toISOString(),
                    tags: ['Doc']
                  },
                  ...prev
                ])
              }
              onGenerateAiDoc={handleGenerateAiDoc}
            />
          )}

          {currentView === 'meetings' && (
            <MeetingsView
              meetings={meetings}
              members={members}
              onApplyAiAction={handleApplyAiAction}
            />
          )}

          {currentView === 'chat' && (
            <TeamChatView
              channels={channels}
              messages={messages}
              members={members}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView analytics={analytics} members={members} />
          )}

          {currentView === 'admin' && (
            <AdminPanel org={org} members={members} auditLogs={auditLogs} onNavigate={setCurrentView} />
          )}

          {currentView === 'billing' && (
            <BillingPaymentView
              org={org}
              members={members}
              invoices={invoices}
              paymentMethods={paymentMethods}
              onPlanUpdated={handlePlanUpdated}
              onAddPaymentMethod={handleAddPaymentMethod}
            />
          )}
        </main>
      </div>

      {/* Floating AI CTO Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentUser={currentUser}
        aiInsights={aiInsights}
        onSendPrompt={sendCopilotPromptApi}
        onApplyAiAction={handleApplyAiAction}
      />

      {/* Command+K Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tasks={tasks}
        wikiDocs={wikiDocs}
        meetings={meetings}
        members={members}
        channels={channels}
        onNavigate={setCurrentView}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        projects={projects}
        members={members}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}
