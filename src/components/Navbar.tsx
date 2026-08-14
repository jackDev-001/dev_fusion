import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sliders,
  Plus,
  Building2,
  ChevronDown,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  UserCheck
} from 'lucide-react';
import { Organization, Workspace, User, Notification } from '../types';
import { TEAM_MEMBERS } from '../data/mockData';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  org: Organization;
  workspace: Workspace;
  currentUser: User;
  teamMembers?: User[];
  notifications: Notification[];
  onOpenSearch: () => void;
  onOpenCopilot: () => void;
  onOpenCreateTask: () => void;
  onMarkNotificationRead: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  org,
  workspace,
  currentUser,
  teamMembers = TEAM_MEMBERS,
  notifications,
  onOpenSearch,
  onOpenCopilot,
  onOpenCreateTask,
  onMarkNotificationRead,
  onNavigate
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Other team members excluding the current user
  const otherMembers = teamMembers.filter((m) => m.id !== currentUser.id);

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-5 flex items-center justify-between shadow-2xs">
      {/* Left: Organization & Workspace Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white font-black flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm tracking-tight">
              Nexus <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200">OS</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate max-w-[140px] sm:max-w-[200px]">
              {org.name}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center text-slate-300">|</div>

        {/* Workspace Selector Pill */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100/80 text-xs text-slate-700 font-bold border border-slate-200/80">
          <span>{workspace.icon}</span>
          <span className="truncate max-w-[160px]">{workspace.name}</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      </div>

      {/* Middle: Global Search Trigger (⌘K) */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/90 text-xs text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span className="truncate font-medium">Search tasks, docs, meetings, chat...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-500 bg-white border border-slate-200 rounded-md shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions & User / Team Section */}
      <div className="flex items-center gap-2.5">
        {/* Quick Create Task */}
        <button
          onClick={onOpenCreateTask}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>

        {/* Operations Hub Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Operations Hub</span>
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Workspace Notifications</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {unreadCount} new
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onMarkNotificationRead(n.id);
                        if (n.link) onNavigate(n.link);
                        setShowNotifs(false);
                      }}
                      className={`p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer flex gap-2.5 ${
                        !n.read ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {n.type === 'RISK_ALERT' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-slate-900">{n.title}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{n.message}</div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Team Members Avatar Stack Pill (Akshita Patel, Vinayak Gautam, Meet, Jeet) */}
        <div className="relative">
          <button
            onClick={() => setShowTeamModal(!showTeamModal)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 transition-all cursor-pointer group shadow-2xs"
            title="Active Team Members"
          >
            <div className="flex -space-x-1.5 overflow-hidden">
              {otherMembers.slice(0, 4).map((member) => (
                <UserAvatar
                  key={member.id}
                  name={member.name}
                  className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white text-[10px] font-black"
                />
              ))}
            </div>
            <div className="hidden xl:flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <span>Team</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-800 font-extrabold">
                {otherMembers.length}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          {/* Team Members Dropdown */}
          {showTeamModal && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-xl p-3.5 z-50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Workspace Core Team</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  4 Active
                </span>
              </div>

              <div className="space-y-2">
                {otherMembers.map((m) => (
                  <div
                    key={m.id}
                    className="p-2 rounded-xl bg-slate-50/70 hover:bg-indigo-50/50 border border-slate-200/60 transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <UserAvatar
                          name={m.name}
                          className="w-7 h-7 rounded-full text-[11px] font-black ring-1 ring-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{m.name}</div>
                        <div className="text-[10px] font-semibold text-slate-500">{m.title}</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white text-indigo-700 border border-slate-200">
                      {m.department}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary Lead User Profile: Aniket Vadhiya */}
        <div className="flex items-center gap-2 pl-2.5 border-l border-slate-200/80">
          <div className="relative">
            <UserAvatar
              name={currentUser.name}
              className="w-8 h-8 rounded-full text-xs font-black ring-2 ring-indigo-500 shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-black text-slate-900 flex items-center gap-1">
              <span>{currentUser.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-extrabold">
                Owner
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">{currentUser.title}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
