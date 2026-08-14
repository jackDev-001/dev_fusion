import React from 'react';
import {
  LayoutDashboard,
  Kanban,
  FileText,
  Calendar,
  MessageSquare,
  BarChart3,
  Shield,
  Sparkles,
  CheckSquare,
  Layers,
  Zap,
  Users
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCopilot: () => void;
  activeRisksCount: number;
  unreadChatCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenCopilot,
  activeRisksCount,
  unreadChatCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'kanban', label: 'Kanban & Sprints', icon: Kanban, badge: 'Active' },
    { id: 'docs', label: 'Wiki & Docs', icon: FileText, badge: null },
    { id: 'meetings', label: 'Meetings', icon: Calendar, badge: '2' },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare, badge: unreadChatCount > 0 ? `${unreadChatCount}` : null },
    { id: 'analytics', label: 'Analytics & Risk', icon: BarChart3, badge: activeRisksCount > 0 ? `${activeRisksCount} Risk` : null, badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400' },
    { id: 'admin', label: 'Admin & RBAC', icon: Shield, badge: null }
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none shadow-xs">
      <div className="py-4 px-2.5 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
          Workspace Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor || 'bg-slate-100 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Copilot Widget Footer */}
      <div className="p-3.5 m-2.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-white text-slate-900 border border-indigo-200/70 shadow-2xs relative overflow-hidden space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-extrabold text-indigo-950">Nexus AI Copilot</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug font-medium">
          Real-time Gemini intelligence evaluating sprint velocity and capacity.
        </p>
        <button
          onClick={onOpenCopilot}
          className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
          <span>Launch AI Insights</span>
        </button>
      </div>
    </aside>
  );
};
