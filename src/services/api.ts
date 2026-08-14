import { Task, WikiDoc, ChatMessage, Meeting, Notification } from '../types';

export async function fetchWorkspaceState() {
  const res = await fetch('/api/workspace/state');
  if (!res.ok) throw new Error('Failed to fetch workspace state');
  return res.json();
}

export async function createTaskApi(taskData: Partial<Task>): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTaskApi(id: string, updates: Partial<Task>): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function addCommentApi(taskId: string, content: string) {
  const res = await fetch(`/api/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

export async function createDocApi(docData: Partial<WikiDoc>): Promise<WikiDoc> {
  const res = await fetch('/api/docs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(docData)
  });
  if (!res.ok) throw new Error('Failed to create doc');
  return res.json();
}

export async function sendMessageApi(channelId: string, content: string): Promise<ChatMessage> {
  const res = await fetch('/api/chat/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channelId, content })
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function markNotificationReadApi(id: string) {
  const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
  return res.json();
}

export async function applyAiActionApi(actionType: string, payload: any) {
  const res = await fetch('/api/ai/apply-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionType, payload })
  });
  if (!res.ok) throw new Error('Failed to apply AI action');
  return res.json();
}

export async function sendCopilotPromptApi(prompt: string) {
  const res = await fetch('/api/ai/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error('Failed to send Copilot prompt');
  return res.json();
}

export async function generateAiDocApi(docTitle: string, category: string, topic: string): Promise<WikiDoc> {
  const res = await fetch('/api/ai/generate-doc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docTitle, category, topic })
  });
  if (!res.ok) throw new Error('Failed to generate AI doc');
  return res.json();
}
