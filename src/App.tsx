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
  INITIAL_AI_INSIGHTS
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
  AICopilotInsight
} from './types';

export default function App() {
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
      .catch((err) => {
        console.log('Running in client state mode');
      });
  }, []);

  // Handlers
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
        status: 'TODO',
        priority: taskData.priority || 'HIGH',
        projectId: taskData.projectId || projects[0].id,
        sprintId: sprints[0]?.id,
        assigneeId: taskData.assigneeId || CURRENT_USER.id,
        reporterId: CURRENT_USER.id,
        storyPoints: taskData.storyPoints || 5,
        estimatedHours: 8,
        loggedHours: 0,
        dueDate: taskData.dueDate || '2026-08-20',
        tags: ['New'],
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
    const comment = {
      id: `cm_${Date.now()}`,
      authorId: CURRENT_USER.id,
      content,
      createdAt: new Date().toISOString()
    };

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t))
    );

    try {
      await addCommentApi(taskId, content);
    } catch (e) {}
  };

  const handleSendMessage = async (channelId: string, content: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      senderId: CURRENT_USER.id,
      content,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      await sendMessageApi(channelId, content);
    } catch (e) {}

    // If message mentions @NexusAI, respond with AI Copilot analysis
    if (content.toLowerCase().includes('@nexusai')) {
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `msg_ai_${Date.now()}`,
          channelId,
          senderId: 'ai_bot',
          content: `⚡ **Nexus AI Sprint Report**:\n- **Active Velocity**: 28/42 Story Points completed\n- **Project Health**: 1 risk detected on Marcus Chen's workload.\n- Use AI Copilot drawer for automated task rebalancing!`,
          timestamp: new Date().toISOString(),
          isAiResponse: true
        };
        setMessages((prev) => [...prev, aiMsg]);
      }, 800);
    }
  };

  const handleApplyAiAction = async (actionType: string, payload: any) => {
    try {
      const res = await applyAiActionApi(actionType, payload);
      // Refresh workspace state
      const updated = await fetchWorkspaceState();
      if (updated.tasks) setTasks(updated.tasks);
      if (updated.aiInsights) setAiInsights(updated.aiInsights);
      if (updated.auditLogs) setAuditLogs(updated.auditLogs);
    } catch (e) {
      if (actionType === 'REASSIGN_TASK') {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === payload.taskId
              ? { ...t, assigneeId: payload.newAssigneeId, aiRiskScore: 10 }
              : t
          )
        );
        setAiInsights((prev) => prev.filter((i) => i.id !== 'ins_1'));
      }
    }
  };

  const handleGenerateAiDoc = async (title: string, category: string, topic: string) => {
    try {
      const newDoc = await generateAiDocApi(title, category, topic);
      setWikiDocs((prev) => [newDoc, ...prev]);
    } catch (e) {
      const fallbackDoc: WikiDoc = {
        id: `doc_${Date.now()}`,
        workspaceId: workspace.id,
        title,
        content: `# ${title}\n\n## Overview\nAuto-generated specification for **${topic}**.\n\n### Key Principles\n- Zero-trust security\n- Multi-tenant isolation\n- Real-time audit trails`,
        authorId: CURRENT_USER.id,
        category: category as any,
        updatedAt: new Date().toISOString(),
        tags: ['AI-Generated', category],
        pinned: false
      };
      setWikiDocs((prev) => [fallbackDoc, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        org={org}
        workspace={workspace}
        currentUser={CURRENT_USER}
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
                    authorId: CURRENT_USER.id,
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
              currentUser={CURRENT_USER}
              onSendMessage={handleSendMessage}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView analytics={analytics} members={members} />
          )}

          {currentView === 'admin' && (
            <AdminPanel org={org} members={members} auditLogs={auditLogs} />
          )}
        </main>
      </div>

      {/* Floating AI CTO Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentUser={CURRENT_USER}
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
