import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Layers,
  FileText,
  Calendar,
  MessageSquare
} from 'lucide-react';
import {
  Project,
  Sprint,
  Task,
  User,
  AICopilotInsight,
  AuditLog,
  WorkspaceAnalytics
} from '../types';
import { UserAvatar } from './UserAvatar';

interface DashboardViewProps {
  projects: Project[];
  activeSprint: Sprint;
  tasks: Task[];
  members: User[];
  aiInsights: AICopilotInsight[];
  auditLogs: AuditLog[];
  analytics: WorkspaceAnalytics;
  onNavigate: (view: string) => void;
  onOpenCreateTask: () => void;
  onApplyAiAction: (actionType: string, payload: any) => void;
  onOpenCopilot: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  activeSprint,
  tasks,
  members,
  aiInsights,
  auditLogs,
  analytics,
  onNavigate,
  onOpenCreateTask,
  onApplyAiAction,
  onOpenCopilot
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'URGENT' && t.status !== 'DONE').length;
  const highRiskTasks = tasks.filter((t) => (t.aiRiskScore || 0) >= 50);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & Executive Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Executive Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Sync Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Core Platform Engineering Workspace • Active Sprint 24 Velocity & Risk Radar
          </p>
        </div>

        {/* Quick Command Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateTask}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
          <button
            onClick={onOpenCopilot}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ask AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Hero Metric Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Sprint Velocity */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Sprint Velocity</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">
              {activeSprint?.completedPoints || 28} <span className="text-sm font-semibold text-slate-400">/ {activeSprint?.totalPoints || 42} pts</span>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              66% Done
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full" style={{ width: '66%' }}></div>
          </div>
        </div>

        {/* Metric 2: Open Tasks & Health */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Active Sprint Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">{tasks.length}</div>
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
              {inProgressTasks} In Progress
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {completedTasks} completed • {urgentTasks} urgent priority
          </p>
        </div>

        {/* Metric 3: AI Predicted Risk Score */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Project Health & Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-amber-600">
              {highRiskTasks.length > 0 ? '1 Critical Risk' : 'Optimal'}
            </div>
            <span className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              NEX-105
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Developer capacity bottleneck detected on Sprint 24
          </p>
        </div>

        {/* Metric 4: Team Efficiency */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Team Efficiency Score</span>
            <Zap className="w-4 h-4 text-purple-600 fill-current" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">94/100</div>
            <span className="text-xs font-black text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
              Top 1% Velocity
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Avg cycle time: 3.2 days per feature delivery
          </p>
        </div>
      </div>

      {/* Main Command Grid: AI Risk Radar & Workload Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Risk & Copilot Action Center */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-white text-slate-900 border border-indigo-200 shadow-xs relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black tracking-tight text-slate-900">
                  Gemini Autonomous Project Risk Radar
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                Action Required
              </span>
            </div>

            {aiInsights.length === 0 ? (
              <div className="p-6 text-center text-xs text-indigo-900 font-medium">
                All workspace risks resolved. Platform running at peak health!
              </div>
            ) : (
              <div className="space-y-3">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 rounded-xl bg-white border border-indigo-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                          {insight.type}
                        </span>
                        <h3 className="text-xs font-black text-slate-900">{insight.title}</h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight.description}</p>
                    </div>

                    {insight.actionLabel && (
                      <button
                        onClick={() => {
                          if (insight.actionPayload?.taskId) {
                            onApplyAiAction('REASSIGN_TASK', insight.actionPayload);
                          } else if (insight.actionPayload?.meetingId) {
                            onApplyAiAction('EXTRACT_MEETING_TASKS', insight.actionPayload);
                          }
                        }}
                        className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current text-slate-950" />
                        <span>{insight.actionLabel}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Projects Directory */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Active Projects & Health Scores
              </h2>
              <button
                onClick={() => onNavigate('kanban')}
                className="text-xs font-extrabold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Kanban Board</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {projects.map((proj) => (
                <div key={proj.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-2xs"
                      style={{ backgroundColor: proj.color }}
                    >
                      {proj.key}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{proj.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium truncate max-w-sm">
                        {proj.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
                        proj.status === 'ON_TRACK'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {proj.status.replace('_', ' ')}
                    </span>
                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900">{proj.healthScore}%</div>
                      <div className="text-[10px] text-slate-400 font-semibold">Health</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Workload Distribution & Activity Stream */}
        <div className="space-y-6">
          {/* Team Workload Heatmap Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Team Capacity & Allocation
              </h2>
            </div>

            <div className="space-y-3">
              {analytics.workloadDistribution.map((item) => {
                const member = members.find((m) => m.id === item.userId);
                const percent = Math.min(Math.round((item.allocatedHours / item.capacityHours) * 100), 100);
                const isOverloaded = item.allocatedHours >= 35;

                return (
                  <div key={item.userId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={item.userName} className="w-5 h-5 rounded-full text-[9px] font-black" />
                        <span className="font-bold text-slate-800">{item.userName}</span>
                      </div>
                      <span className={`font-mono text-[11px] font-black ${isOverloaded ? 'text-rose-600' : 'text-slate-500'}`}>
                        {item.allocatedHours}h / {item.capacityHours}h
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isOverloaded ? 'bg-rose-500' : 'bg-indigo-600'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Log Activity Stream */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-slate-500" />
              Live Security & Audit Trail
            </h2>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs space-y-0.5 border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-slate-900">{log.actorName}</span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium text-[11px]">{log.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
