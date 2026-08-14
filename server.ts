import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  CURRENT_USER,
  TEAM_MEMBERS,
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
} from './src/data/mockData';
import { Task, TaskStatus, WikiDoc, Meeting, ChatMessage, Notification, AuditLog } from './src/types';

// In-Memory Database State for Instant Real-Time Persistence
let org = { ...INITIAL_ORG };
let workspace = { ...INITIAL_WORKSPACE };
let members = [...TEAM_MEMBERS];
let projects = [...INITIAL_PROJECTS];
let sprints = [...INITIAL_SPRINTS];
let tasks: Task[] = [...INITIAL_TASKS];
let wikiDocs: WikiDoc[] = [...INITIAL_WIKI_DOCS];
let meetings: Meeting[] = [...INITIAL_MEETINGS];
let channels = [...INITIAL_CHANNELS];
let messages: ChatMessage[] = [...INITIAL_CHAT_MESSAGES];
let notifications: Notification[] = [...INITIAL_NOTIFICATIONS];
let auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let analytics = { ...INITIAL_ANALYTICS };
let aiInsights = [...INITIAL_AI_INSIGHTS];

// Initialize Gemini SDK with User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Tenant Authentication & Isolation Middleware
  app.use('/api', (req, res, next) => {
    // In production, token verifies orgId & workspaceId
    req.headers['x-org-id'] = org.id;
    req.headers['x-workspace-id'] = workspace.id;
    next();
  });

  // --- REST API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get full workspace state
  app.get('/api/workspace/state', (req, res) => {
    res.json({
      currentUser: CURRENT_USER,
      org,
      workspace,
      members,
      projects,
      sprints,
      tasks,
      wikiDocs,
      meetings,
      channels,
      messages,
      notifications,
      auditLogs,
      analytics,
      aiInsights
    });
  });

  // Task Mutations
  app.post('/api/tasks', (req, res) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      code: `NEX-${100 + tasks.length + 1}`,
      title: req.body.title || 'New Task',
      description: req.body.description || '',
      status: req.body.status || 'TODO',
      priority: req.body.priority || 'MEDIUM',
      projectId: req.body.projectId || projects[0].id,
      sprintId: req.body.sprintId || sprints[0].id,
      assigneeId: req.body.assigneeId || CURRENT_USER.id,
      reporterId: CURRENT_USER.id,
      storyPoints: req.body.storyPoints || 3,
      estimatedHours: req.body.estimatedHours || 8,
      loggedHours: 0,
      dueDate: req.body.dueDate || '2026-08-20',
      tags: req.body.tags || ['Feature'],
      subtasks: req.body.subtasks || [],
      comments: [],
      attachments: [],
      aiRiskScore: 10,
      aiRiskReasoning: 'Newly created task',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.unshift(newTask);

    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      actorName: CURRENT_USER.name,
      action: 'TASK_CREATED',
      target: `Created task ${newTask.code}: ${newTask.title}`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    });

    res.status(201).json(newTask);
  });

  app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const prevStatus = tasks[index].status;
    tasks[index] = {
      ...tasks[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    if (req.body.status && req.body.status !== prevStatus) {
      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        actorName: CURRENT_USER.name,
        action: 'TASK_STATUS_CHANGE',
        target: `${tasks[index].code} moved from ${prevStatus} -> ${req.body.status}`,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1'
      });
    }

    res.json(tasks[index]);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter((t) => t.id !== id);
    res.json({ success: true, id });
  });

  // Task Subtask Toggle / Add Comment
  app.post('/api/tasks/:id/comments', (req, res) => {
    const { id } = req.params;
    const task = tasks.find((t) => t.id === id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const comment = {
      id: `cm_${Date.now()}`,
      authorId: CURRENT_USER.id,
      content: req.body.content || '',
      createdAt: new Date().toISOString()
    };

    task.comments.push(comment);
    res.json(comment);
  });

  // Wiki Doc Mutations
  app.post('/api/docs', (req, res) => {
    const newDoc: WikiDoc = {
      id: `doc_${Date.now()}`,
      workspaceId: workspace.id,
      title: req.body.title || 'Untitled Document',
      content: req.body.content || '',
      authorId: CURRENT_USER.id,
      category: req.body.category || 'Engineering',
      updatedAt: new Date().toISOString(),
      tags: req.body.tags || ['General'],
      pinned: req.body.pinned || false
    };

    wikiDocs.unshift(newDoc);
    res.status(201).json(newDoc);
  });

  // Chat Message Mutations
  app.post('/api/chat/messages', (req, res) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId: req.body.channelId || channels[0].id,
      senderId: CURRENT_USER.id,
      content: req.body.content || '',
      timestamp: new Date().toISOString()
    };

    messages.push(newMsg);
    res.status(201).json(newMsg);
  });

  // Mark Notification Read
  app.post('/api/notifications/:id/read', (req, res) => {
    const notif = notifications.find((n) => n.id === req.params.id);
    if (notif) notif.read = true;
    res.json({ success: true });
  });

  // Apply AI Action (e.g. reassign task, extract meeting action items)
  app.post('/api/ai/apply-action', (req, res) => {
    const { actionType, payload } = req.body;

    if (actionType === 'REASSIGN_TASK') {
      const task = tasks.find((t) => t.id === payload.taskId);
      if (task) {
        const oldAssignee = members.find((m) => m.id === task.assigneeId)?.name;
        task.assigneeId = payload.newAssigneeId;
        task.aiRiskScore = 15;
        task.aiRiskReasoning = 'Workload rebalanced by AI Copilot';
        const newAssignee = members.find((m) => m.id === payload.newAssigneeId)?.name;

        auditLogs.unshift({
          id: `aud_${Date.now()}`,
          actorName: 'AI Copilot Engine',
          action: 'WORKLOAD_AUTO_BALANCED',
          target: `Reassigned ${task.code} from ${oldAssignee} to ${newAssignee}`,
          timestamp: new Date().toISOString(),
          ipAddress: '127.0.0.1'
        });

        // Remove from insights
        aiInsights = aiInsights.filter((i) => i.id !== 'ins_1');

        return res.json({ success: true, message: `Task ${task.code} successfully reassigned to ${newAssignee}!` });
      }
    }

    if (actionType === 'EXTRACT_MEETING_TASKS') {
      const meeting = meetings.find((m) => m.id === payload.meetingId);
      if (meeting && meeting.actionItems) {
        const created: Task[] = [];
        meeting.actionItems.forEach((item, idx) => {
          const newTask: Task = {
            id: `task_meet_${Date.now()}_${idx}`,
            code: `NEX-${150 + tasks.length + idx}`,
            title: item,
            description: `Auto-generated from meeting: "${meeting.title}"`,
            status: 'TODO',
            priority: 'HIGH',
            projectId: projects[0].id,
            sprintId: sprints[0].id,
            assigneeId: members[(idx + 1) % members.length].id,
            reporterId: CURRENT_USER.id,
            storyPoints: 3,
            estimatedHours: 6,
            loggedHours: 0,
            dueDate: '2026-08-18',
            tags: ['Action-Item', 'Meeting'],
            subtasks: [],
            comments: [],
            attachments: [],
            aiRiskScore: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          tasks.unshift(newTask);
          created.push(newTask);
        });

        aiInsights = aiInsights.filter((i) => i.id !== 'ins_2');

        return res.json({ success: true, count: created.length, message: `Created ${created.length} actionable tasks from meeting!` });
      }
    }

    res.json({ success: true });
  });

  // --- SERVER-SIDE GEMINI AI ENDPOINTS ---

  // 1. AI Copilot Chat Endpoint (understands full live workspace state)
  app.post('/api/ai/copilot', async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: `⚡ **Nexus Operations Engine**: I received your query: "${prompt}".\n\nWorkspace telemetry summary:\n- Active Sprint: Sprint 24 (42 points total, 28 done)\n- Open Tasks: ${tasks.length} tasks\n- High Risk Tasks: ${tasks.filter((t) => (t.aiRiskScore || 0) > 50).map((t) => t.code).join(', ') || 'None'}`,
          actionSuggestions: []
        });
      }

      // Context construction from live workspace data
      const contextSummary = `
You are Nexus Operations Hub, the automated engineering coordinator for "${org.name}" workspace "${workspace.name}".
Current User: ${CURRENT_USER.name} (${CURRENT_USER.title})
Team Members: ${members.map((m) => `${m.name} (${m.title}, capacity ${m.capacityHoursPerWeek}h/wk)`).join('; ')}
Active Sprint: ${sprints[0]?.name} (Goal: ${sprints[0]?.goal})
Active Tasks: ${JSON.stringify(tasks.map((t) => ({ code: t.code, title: t.title, status: t.status, priority: t.priority, assignee: members.find((m) => m.id === t.assigneeId)?.name, risk: t.aiRiskScore })))}
Active Meetings: ${meetings.map((m) => m.title).join(', ')}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: `${contextSummary}\nProvide concise, highly authoritative, actionable engineering and sprint management advice. Structure your response with bold key metrics, bullet points, and actionable next steps. Format with markdown.`
        }
      });

      res.json({
        text: response.text || 'Operations engine processed your query successfully.'
      });
    } catch (err: any) {
      console.error('Gemini Copilot Error:', err);
      res.status(500).json({
        error: 'Failed to process Gemini Copilot query',
        message: err.message
      });
    }
  });

  // 2. AI Risk Analyzer & Predictor
  app.post('/api/ai/risk-analysis', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        // Fallback intelligent evaluation
        tasks.forEach((t) => {
          if (t.assigneeId === 'usr_3' && t.status !== 'DONE') {
            t.aiRiskScore = 78;
            t.aiRiskReasoning = 'Marcus Chen is assigned 3 tasks totaling 26 hours due in 48 hours.';
          } else {
            t.aiRiskScore = Math.floor(Math.random() * 20);
          }
        });
        return res.json({ success: true, tasks });
      }

      const prompt = `Analyze these tasks and evaluate risk scores (0-100) and risk reasoning for each task based on assignee capacity, due dates, and estimates:
      ${JSON.stringify(tasks)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Return a high-accuracy risk analysis for software tasks in JSON format.'
        }
      });

      res.json({
        success: true,
        rawAnalysis: response.text,
        tasks
      });
    } catch (err: any) {
      console.error('Gemini Risk Analysis Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 3. AI Sprint Planner
  app.post('/api/ai/sprint-plan', async (req, res) => {
    try {
      const { sprintGoal, storyPointBudget } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        const generatedTasks = [
          { title: 'Setup Multi-Region Database Replica', priority: 'HIGH', storyPoints: 5, assignee: 'Elena Rostova' },
          { title: 'Implement Rate Limiting & DDOS Filter', priority: 'URGENT', storyPoints: 8, assignee: 'Marcus Chen' },
          { title: 'Design Real-Time Activity Feed', priority: 'MEDIUM', storyPoints: 3, assignee: 'Devon Wright' }
        ];
        return res.json({ success: true, goal: sprintGoal, suggestedTasks: generatedTasks });
      }

      const prompt = `Create a structured sprint task list for goal: "${sprintGoal}" with budget ${storyPointBudget} story points. Consider team members: ${members.map((m) => m.name).join(', ')}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an Agile Certified Scrum Master & Engineering Director. Output clear task recommendations.'
        }
      });

      res.json({
        success: true,
        plan: response.text
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. AI Document Generator (Notion-style)
  app.post('/api/ai/generate-doc', async (req, res) => {
    try {
      const { docTitle, category, topic } = req.body;

      let docContent = '';
      if (process.env.GEMINI_API_KEY) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `Draft a comprehensive, production-ready enterprise technical markdown document titled "${docTitle}" on topic "${topic}" for category "${category}". Include architecture diagrams, code blocks, security guidelines, and SLA requirements.`
        });
        docContent = response.text || '';
      } else {
        docContent = `# ${docTitle}\n\n## Overview\nThis enterprise document covers **${topic}** for the **${category}** division.\n\n### Core Architecture\n- Zero-trust security model\n- Multi-region database synchronization\n- Real-time audit trails\n\n\`\`\`ts\n// Sample Integration Code\nexport async function verifyTenantScope(orgId: string) {\n  return await db.tenants.findUnique({ where: { orgId } });\n}\n\`\`\`\n\n### SLA Commitments\n- 99.99% Availability\n- <50ms P99 latency`;
      }

      const newDoc: WikiDoc = {
        id: `doc_${Date.now()}`,
        workspaceId: workspace.id,
        title: docTitle,
        content: docContent,
        authorId: CURRENT_USER.id,
        category: category || 'Engineering',
        updatedAt: new Date().toISOString(),
        tags: ['Spec-Document', category],
        pinned: false
      };

      wikiDocs.unshift(newDoc);
      res.status(201).json(newDoc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Serve static assets or Vite dev middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Nexus Enterprise Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
