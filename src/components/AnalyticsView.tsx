import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  Users,
  ShieldCheck,
  AlertTriangle,
  Award
} from 'lucide-react';
import { WorkspaceAnalytics, User } from '../types';

interface AnalyticsViewProps {
  analytics: WorkspaceAnalytics;
  members: User[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, members }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Velocity, Workload & Risk Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Executive dashboard powered by real-time telemetry and Gemini Predictive Risk Engine
            </p>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="text-xs font-semibold text-slate-500">Average Cycle Time</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {analytics.cycleTimeDays} days
          </div>
          <div className="text-[10px] text-emerald-600 font-bold">18% faster than industry benchmark</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="text-xs font-semibold text-slate-500">Completed Points (Sprint 24)</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {analytics.completedTasksThisSprint * 3.5} pts
          </div>
          <div className="text-[10px] text-indigo-600 font-bold">On track for target velocity</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="text-xs font-semibold text-slate-500">Active Bottlenecks</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {analytics.openRisksCount} Risks
          </div>
          <div className="text-[10px] text-amber-600 font-bold">Marcus Chen overallocated</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="text-xs font-semibold text-slate-500">Team Productivity Score</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {analytics.teamProductivityScore}/100
          </div>
          <div className="text-[10px] text-purple-600 font-bold">Top 1% Engineering Velocity</div>
        </div>
      </div>

      {/* Main Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Velocity Trend Chart Visual */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Historical Velocity (Sprints 19 - 24)
            </h2>
          </div>

          <div className="h-52 flex items-end gap-3 pt-6 px-2">
            {analytics.velocity.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-500">{val} pts</span>
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    idx === analytics.velocity.length - 1
                      ? 'bg-gradient-to-t from-indigo-600 to-purple-600'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                  style={{ height: `${(val / 50) * 100}%` }}
                ></div>
                <span className="text-[10px] font-mono font-bold text-slate-400">S{19 + idx}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workload Distribution Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              Developer Allocation vs 40h Weekly Capacity
            </h2>
          </div>

          <div className="space-y-4">
            {analytics.workloadDistribution.map((item) => {
              const percent = Math.round((item.allocatedHours / item.capacityHours) * 100);
              const isOver = item.allocatedHours >= 35;

              return (
                <div key={item.userId} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{item.userName}</span>
                    <span className={isOver ? 'text-rose-500' : 'text-slate-500'}>
                      {item.allocatedHours}h / 40h ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isOver ? 'bg-rose-500' : 'bg-purple-600'}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
