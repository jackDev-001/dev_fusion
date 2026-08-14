import React from 'react';
import {
  Shield,
  Key,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Lock,
  ExternalLink
} from 'lucide-react';
import { Organization, User, AuditLog } from '../types';
import { UserAvatar } from './UserAvatar';

interface AdminPanelProps {
  org: Organization;
  members: User[];
  auditLogs: AuditLog[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ org, members, auditLogs }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold shadow-xs">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Organization Admin & Security Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-tenant security isolation, RBAC matrix, and immutable audit trails
            </p>
          </div>
        </div>
      </div>

      {/* Organization Tier Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-black">{org.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              {org.plan}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Row-Level Tenant Isolation Active • Org Slug: <code className="font-mono">{org.slug}</code>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-white/10 text-emerald-300 font-bold border border-white/10 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>SOC2 Compliant Isolation</span>
          </span>
        </div>
      </div>

      {/* Grid: RBAC Member Table & Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Team RBAC Roles */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Member Roles & Access Control
            </h2>
            <span className="text-xs text-slate-400">{members.length} members</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 flex items-center gap-2.5">
                      <UserAvatar name={m.name} className="w-6 h-6 rounded-full text-[10px] font-black" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                        <div className="text-[10px] text-slate-400">{m.email}</div>
                      </div>
                    </td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300 font-medium">{m.title}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {m.role}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Integration Status Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Key className="w-4 h-4 text-purple-500" />
              Connected Enterprise Integrations
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">GitHub Webhooks</div>
                  <div className="text-[10px] text-slate-400">PR status sync & auto-transitions</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  Connected
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Google Workspace</div>
                  <div className="text-[10px] text-slate-400">Google Meet & Calendar sync</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  Connected
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">AWS S3 Storage</div>
                  <div className="text-[10px] text-slate-400">Encrypted file attachments</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Audit Trail Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Clock className="w-4 h-4 text-indigo-500" />
          Immutable System Audit Logs
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{log.actorName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {log.action}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">{log.target}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="font-mono text-[10px] text-slate-400">{log.ipAddress}</div>
                <div className="text-[10px] text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
