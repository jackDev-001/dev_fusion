import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  Filter,
  CheckSquare,
  AlertTriangle,
  User as UserIcon,
  MessageSquare,
  Paperclip,
  Clock,
  ChevronRight,
  MoreVertical,
  Zap,
  Tag,
  X
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Project, User, Sprint } from '../types';
import { UserAvatar } from './UserAvatar';

interface ProjectKanbanViewProps {
  tasks: Task[];
  projects: Project[];
  members: User[];
  sprints: Sprint[];
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
  onAddComment: (taskId: string, content: string) => void;
  onOpenCreateTask: () => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'BACKLOG', label: 'Backlog', color: 'border-slate-300' },
  { id: 'TODO', label: 'To Do', color: 'border-blue-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-indigo-600' },
  { id: 'IN_REVIEW', label: 'In Review', color: 'border-purple-600' },
  { id: 'DONE', label: 'Done', color: 'border-emerald-600' }
];

export const ProjectKanbanView: React.FC<ProjectKanbanViewProps> = ({
  tasks,
  projects,
  members,
  sprints,
  onTaskUpdate,
  onAddComment,
  onOpenCreateTask
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string>('ALL');
  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [newComment, setNewComment] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (filterAssignee !== 'ALL' && t.assigneeId !== filterAssignee) return false;
    if (filterProject !== 'ALL' && t.projectId !== filterProject) return false;
    return true;
  });

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'LOW':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top Filter & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-xs">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Agile Kanban & Sprint Board
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Sprint 24 • Real-time status transitions & Gemini Risk Evaluation
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Assignee Filter */}
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-bold shadow-2xs"
          >
            <option value="ALL">All Assignees</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Project Filter */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-bold shadow-2xs"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenCreateTask}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0 overflow-x-auto pb-2">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl bg-slate-50 border border-slate-200/90 p-3 min-w-[240px] shadow-2xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-slate-200/80 text-[10px] font-black text-slate-700 flex items-center justify-center">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Task Cards Stream */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colTasks.map((task) => {
                  const assignee = members.find((m) => m.id === task.assigneeId);
                  const subtasksDone = task.subtasks.filter((s) => s.completed).length;

                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2.5 group"
                    >
                      {/* Code + Priority Badge */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-black text-indigo-600">
                          {task.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {task.aiRiskScore && task.aiRiskScore > 40 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              {task.aiRiskScore}% Risk
                            </span>
                          )}
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-black border ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </h3>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer Info: Subtasks, Comments & Assignee Avatar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
                        <div className="flex items-center gap-2">
                          {task.subtasks.length > 0 && (
                            <span className="flex items-center gap-1 font-bold">
                              <CheckSquare className="w-3 h-3 text-emerald-600" />
                              {subtasksDone}/{task.subtasks.length}
                            </span>
                          )}
                          {task.comments.length > 0 && (
                            <span className="flex items-center gap-1 font-bold">
                              <MessageSquare className="w-3 h-3" />
                              {task.comments.length}
                            </span>
                          )}
                        </div>

                        {assignee && (
                          <UserAvatar
                            name={assignee.name}
                            className="w-5 h-5 rounded-full text-[9px] font-black"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950">
                  {selectedTask.code}
                </span>
                <select
                  value={selectedTask.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as TaskStatus;
                    onTaskUpdate(selectedTask.id, { status: newStatus });
                    setSelectedTask({ ...selectedTask, status: newStatus });
                  }}
                  className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedTask.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>

              {/* AI Risk Breakdown Banner */}
              {selectedTask.aiRiskScore && selectedTask.aiRiskScore > 30 && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Gemini Risk Evaluation ({selectedTask.aiRiskScore}% Risk)</span>
                  </div>
                  <p className="text-[11px] leading-snug">{selectedTask.aiRiskReasoning}</p>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assignee</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {members.find((m) => m.id === selectedTask.assigneeId)?.name || 'Unassigned'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Story Points</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedTask.storyPoints} pts
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Due Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedTask.dueDate}
                  </span>
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Subtasks ({selectedTask.subtasks.filter((s) => s.completed).length}/{selectedTask.subtasks.length})
                </h3>
                <div className="space-y-1.5">
                  {selectedTask.subtasks.map((sub) => (
                    <label
                      key={sub.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => {
                          const updatedSubs = selectedTask.subtasks.map((s) =>
                            s.id === sub.id ? { ...s, completed: !s.completed } : s
                          );
                          onTaskUpdate(selectedTask.id, { subtasks: updatedSubs });
                          setSelectedTask({ ...selectedTask, subtasks: updatedSubs });
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={sub.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                        {sub.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Discussion & Activity ({selectedTask.comments.length})
                </h3>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedTask.comments.map((cm) => {
                    const author = members.find((m) => m.id === cm.authorId);
                    return (
                      <div key={cm.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900 dark:text-white">{author?.name}</span>
                          <span className="text-slate-400 text-[10px]">
                            {new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{cm.content}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Add Comment Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newComment.trim()) {
                        onAddComment(selectedTask.id, newComment);
                        setNewComment('');
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    onClick={() => {
                      if (newComment.trim()) {
                        onAddComment(selectedTask.id, newComment);
                        setNewComment('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer hover:bg-indigo-700"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
