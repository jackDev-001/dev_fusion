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
  UserCheck,
  CreditCard,
  LogOut,
  Shield,
  Sparkles
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
  onLogout?: () => void;
  onSwitchUser?: (user: User) => void;
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
  onNavigate,
  onLogout,
  onSwitchUser
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

        {/* Plan Badge / Quick Upgrade Link */}
        <button
          onClick={() => onNavigate('billing')}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200/80 transition-colors cursor-pointer"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>{org.plan}</span>
        </button>
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
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowTeamModal(false);
              setShowUserMenu(false);
            }}
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
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                        !n.read ? 'bg-indigo-50/40 font-medium' : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Team Members Avatar Group Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTeamModal(!showTeamModal);
              setShowNotifs(false);
              setShowUserMenu(false);
            }}
            className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
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
                  {teamMembers.length} Active
                </span>
              </div>

              <div className="space-y-2">
                {otherMembers.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (onSwitchUser) onSwitchUser(m);
                      setShowTeamModal(false);
                    }}
                    className="p-2 rounded-xl bg-slate-50/70 hover:bg-indigo-50/80 border border-slate-200/60 transition-all flex items-center justify-between gap-2 cursor-pointer"
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
                      Switch
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current User Profile & Account Menu */}
        <div className="relative pl-2.5 border-l border-slate-200/80">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifs(false);
              setShowTeamModal(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
          >
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
                  {currentUser.role}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">{currentUser.title}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
          </button>

          {/* User Account Popover Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2.5 z-50 space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-black text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                <div className="text-[10px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>{currentUser.department} • {currentUser.role}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs font-bold text-slate-700">
                <button
                  onClick={() => {
                    onNavigate('billing');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-left cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Billing & Subscription</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('admin');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-left cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Security & RBAC Matrix</span>
                </button>
              </div>

              {/* Logout Option */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out & Lock Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
